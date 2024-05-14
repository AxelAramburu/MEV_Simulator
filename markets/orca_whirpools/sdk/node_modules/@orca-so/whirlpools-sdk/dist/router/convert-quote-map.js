"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBestRoutesFromQuoteMap = void 0;
const bn_js_1 = __importDefault(require("bn.js"));
const k_smallest_partition_1 = require("../utils/math/k-smallest-partition");
function getBestRoutesFromQuoteMap(quoteMap, amountSpecifiedIsInput, opts) {
    const { numTopRoutes, maxSplits } = opts;
    const sortedRoutes = [
        ...getRankedRoutes(quoteMap, amountSpecifiedIsInput, numTopRoutes, maxSplits),
        ...getSingleHopSplit(quoteMap),
    ].sort(getRouteCompareFn(amountSpecifiedIsInput));
    return convertInternalRoutesToTradeRoutes(sortedRoutes);
}
exports.getBestRoutesFromQuoteMap = getBestRoutesFromQuoteMap;
function convertInternalRoutesToTradeRoutes(internalRoutes) {
    const tradeRoutes = internalRoutes.map((internalRoute) => {
        const { quotes, totalIn, totalOut } = internalRoute;
        return {
            subRoutes: quotes.map((quote) => convertPathQuoteToSubTradeRoute(quote)),
            totalAmountIn: totalIn,
            totalAmountOut: totalOut,
        };
    });
    return tradeRoutes;
}
function convertPathQuoteToSubTradeRoute(pathQuote) {
    const { calculatedEdgeQuotes, path, splitPercent, amountIn, amountOut } = pathQuote;
    return {
        path,
        splitPercent,
        amountIn,
        amountOut,
        hopQuotes: calculatedEdgeQuotes,
    };
}
function getSingleHopSplit(quoteMap) {
    const fullFlow = quoteMap[100];
    if (fullFlow) {
        return fullFlow
            .filter((f) => f.calculatedEdgeQuotes.length == 1)
            .map((f) => {
            const oneHop = f.calculatedEdgeQuotes[0];
            return {
                quotes: [f],
                splitPercent: 100,
                totalIn: oneHop.amountIn,
                totalOut: oneHop.amountOut,
            };
        })
            .flatMap((g) => (!!g ? g : []));
    }
    return [];
}
function getRankedRoutes(percentMap, amountSpecifiedIsInput, topN, maxSplits) {
    let routes = generateRoutes(percentMap, maxSplits);
    // Run quick select algorithm to partition the topN results, mutating inplace
    const routeCompare = getRouteCompareFn(amountSpecifiedIsInput);
    if (routes.length <= topN) {
        return routes.sort(routeCompare);
    }
    (0, k_smallest_partition_1.kSmallestPartition)(routes, topN, 0, routes.length - 1, routeCompare);
    return routes.slice(0, topN).sort(routeCompare);
}
function generateRoutes(percentMap, maxSplits) {
    let routes = [];
    buildRoutes(percentMap, maxSplits, {
        quotes: [],
        splitPercent: 0,
        totalIn: new bn_js_1.default(0),
        totalOut: new bn_js_1.default(0),
    }, routes);
    return routes;
}
function buildRoutes(quotePercentMap, maxSplits, currentRoute, routes) {
    const { splitPercent: percent, quotes } = currentRoute;
    const percents = Object.keys(quotePercentMap).map((percent) => Number(percent));
    for (let i = percents.length - 1; i >= 0; i--) {
        const nextPercent = percents[i];
        const newPercentTotal = percent + nextPercent;
        // Optimization to prevent exceeding 100% flow and excess combinations of flow by only using decreasing
        // amounts of flow percentages
        const nextPercentIsSmaller = quotes.length > 0 && nextPercent > quotes[quotes.length - 1].splitPercent;
        if (newPercentTotal > 100 || nextPercentIsSmaller) {
            continue;
        }
        const nextPercentQuotes = quotePercentMap[nextPercent];
        for (let j = 0; j < nextPercentQuotes.length; j++) {
            const nextQuote = nextPercentQuotes[j];
            // Don't use a quote that shares a pool with an existing quote
            const hasReusedPools = nextQuote.edgesPoolAddrs.some((r1) => quotes.some((r2) => r2.edgesPoolAddrs.some((r3) => r3.indexOf(r1) !== -1)));
            if (hasReusedPools) {
                continue;
            }
            // todo: Doesn't take into transaction fees
            // double-hops, multi-route penalties, benefits for pairs that can share lookup tables
            const nextRoute = {
                quotes: [...quotes, nextQuote],
                splitPercent: newPercentTotal,
                totalIn: currentRoute.totalIn.add(nextQuote.amountIn),
                totalOut: currentRoute.totalOut.add(nextQuote.amountOut),
            };
            // Remove the current and prior routes from consideration
            const nextCandidateQuotes = nextPercentQuotes.slice(j + 1);
            if (newPercentTotal === 100) {
                // If we have reached 100% flow routed, we add it to the set of valid route sets
                routes.push(nextRoute);
            }
            else if (quotes.length + 1 != maxSplits) {
                // Otherwise, recursively build route sets
                buildRoutes({
                    ...quotePercentMap,
                    [nextPercent]: nextCandidateQuotes,
                }, maxSplits, nextRoute, routes);
            }
        }
    }
}
function getRouteCompareFn(amountSpecifiedIsInput) {
    return amountSpecifiedIsInput ? routesCompareForInputAmount : routesCompareForOutputAmount;
}
function routesCompareForInputAmount(a, b) {
    return b.totalOut.cmp(a.totalOut);
}
function routesCompareForOutputAmount(a, b) {
    return a.totalIn.cmp(b.totalIn);
}

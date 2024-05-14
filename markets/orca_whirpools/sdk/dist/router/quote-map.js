"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getQuoteMap = void 0;
const common_sdk_1 = require("@orca-so/common-sdk");
const bn_js_1 = __importDefault(require("bn.js"));
const fetcher_1 = require("../network/public/fetcher");
const public_1 = require("../quotes/public");
const public_2 = require("../utils/public");
const batch_swap_quote_1 = require("./batch-swap-quote");
async function getQuoteMap(trade, paths, amountSpecifiedIsInput, programId, fetcher, opts) {
    const { percentIncrement, numTopPartialQuotes } = opts;
    const { tokenIn, tokenOut, tradeAmount } = trade;
    const { percents, amounts } = getSplitPercentageAmts(tradeAmount, percentIncrement);
    // The max route length is the number of iterations of quoting that we need to do
    const maxRouteLength = Math.max(...paths.map((path) => path.edges.length), 0);
    // For hop 0 of all routes, get swap quotes using [inputAmount, inputTokenMint]
    // For hop 1..n of all routes, get swap quotes using [outputAmount, outputTokenMint] of hop n-1 as input
    const quoteMap = {};
    let iteration = Array.from(Array(maxRouteLength).keys());
    if (!amountSpecifiedIsInput) {
        iteration = iteration.reverse();
    }
    try {
        for (const hop of iteration) {
            // Each batch of quotes needs to be iterative
            const quoteUpdates = buildQuoteUpdateRequests(tokenIn, tokenOut, paths, percents, amounts, hop, amountSpecifiedIsInput, quoteMap);
            const quoteParams = await (0, batch_swap_quote_1.batchBuildSwapQuoteParams)(quoteUpdates.map((update) => update.request), common_sdk_1.AddressUtil.toPubKey(programId), fetcher, fetcher_1.PREFER_CACHE);
            populateQuoteMap(quoteUpdates, quoteParams, quoteMap);
        }
    }
    catch (e) {
        throw e;
    }
    return sanitizeQuoteMap(quoteMap, numTopPartialQuotes, amountSpecifiedIsInput);
}
exports.getQuoteMap = getQuoteMap;
function populateQuoteMap(quoteUpdates, quoteParams, quoteMap) {
    for (const { splitPercent, pathIndex, quoteIndex, edgeIndex, request } of quoteUpdates) {
        const swapParam = quoteParams[quoteIndex];
        const path = quoteMap[splitPercent][pathIndex];
        try {
            const quote = (0, public_1.swapQuoteWithParams)(swapParam, common_sdk_1.Percentage.fromFraction(0, 1000));
            const { whirlpoolData, tokenAmount, aToB, amountSpecifiedIsInput } = swapParam;
            const [mintA, mintB, vaultA, vaultB] = [
                whirlpoolData.tokenMintA.toBase58(),
                whirlpoolData.tokenMintB.toBase58(),
                whirlpoolData.tokenVaultA.toBase58(),
                whirlpoolData.tokenVaultB.toBase58(),
            ];
            const [inputMint, outputMint] = aToB ? [mintA, mintB] : [mintB, mintA];
            path.calculatedEdgeQuotes[edgeIndex] = {
                success: true,
                amountIn: amountSpecifiedIsInput ? tokenAmount : quote.estimatedAmountIn,
                amountOut: amountSpecifiedIsInput ? quote.estimatedAmountOut : tokenAmount,
                whirlpool: request.whirlpool,
                inputMint,
                outputMint,
                mintA,
                mintB,
                vaultA,
                vaultB,
                quote,
                snapshot: {
                    aToB: swapParam.aToB,
                    sqrtPrice: whirlpoolData.sqrtPrice,
                    feeRate: public_2.PoolUtil.getFeeRate(whirlpoolData.feeRate),
                },
            };
        }
        catch (e) {
            const errorCode = e.errorCode;
            path.calculatedEdgeQuotes[edgeIndex] = {
                success: false,
                error: errorCode,
            };
            continue;
        }
    }
}
function buildQuoteUpdateRequests(tokenIn, tokenOut, paths, percents, amounts, hop, amountSpecifiedIsInput, quoteMap) {
    // Each batch of quotes needs to be iterative
    const quoteUpdates = [];
    for (let amountIndex = 0; amountIndex < amounts.length; amountIndex++) {
        const percent = percents[amountIndex];
        const tradeAmount = amounts[amountIndex];
        // Initialize quote map for first hop
        if (!quoteMap[percent]) {
            quoteMap[percent] = Array(paths.length);
        }
        // Iterate over all routes
        for (let pathIndex = 0; pathIndex < paths.length; pathIndex++) {
            const path = paths[pathIndex];
            const edges = path.edges;
            // If the current route is already complete (amountSpecifiedIsInput = true) or if the current hop is beyond
            // this route's length (amountSpecifiedIsInput = false), don't do anything
            if (amountSpecifiedIsInput ? edges.length <= hop : hop > edges.length - 1) {
                continue;
            }
            const startingRouteEval = amountSpecifiedIsInput ? hop === 0 : hop === edges.length - 1;
            const poolsPath = common_sdk_1.AddressUtil.toStrings(edges.map((edge) => edge.poolAddress));
            // If this is the first hop of the route, initialize the quote map
            if (startingRouteEval) {
                quoteMap[percent][pathIndex] = {
                    path: path,
                    splitPercent: percent,
                    edgesPoolAddrs: poolsPath,
                    calculatedEdgeQuotes: Array(edges.length),
                };
            }
            const currentQuote = quoteMap[percent][pathIndex];
            const poolAddr = poolsPath[hop];
            const lastHop = amountSpecifiedIsInput
                ? currentQuote.calculatedEdgeQuotes[hop - 1]
                : currentQuote.calculatedEdgeQuotes[hop + 1];
            // If this is the first hop, use the input mint and amount, otherwise use the output of the last hop
            let tokenAmount;
            let tradeToken;
            if (startingRouteEval) {
                tokenAmount = tradeAmount;
                tradeToken = amountSpecifiedIsInput ? tokenIn : tokenOut;
            }
            else {
                if (!lastHop?.success) {
                    continue;
                }
                tokenAmount = amountSpecifiedIsInput ? lastHop.amountOut : lastHop.amountIn;
                tradeToken = amountSpecifiedIsInput ? lastHop.outputMint : lastHop.inputMint;
            }
            quoteUpdates.push({
                splitPercent: percent,
                pathIndex,
                edgeIndex: hop,
                quoteIndex: quoteUpdates.length,
                request: {
                    whirlpool: poolAddr,
                    tradeTokenMint: tradeToken,
                    tokenAmount,
                    amountSpecifiedIsInput,
                },
            });
        }
    }
    return quoteUpdates;
}
/**
 * Annotate amountIn/amountOut for calculations
 * @param tradeAmount
 * @param quoteMap
 * @returns
 */
function sanitizeQuoteMap(quoteMap, pruneN, amountSpecifiedIsInput) {
    const percents = Object.keys(quoteMap).map((percent) => Number(percent));
    const cleanedQuoteMap = {};
    const failureErrors = new Set();
    for (let i = 0; i < percents.length; i++) {
        const percent = percents[i];
        const uncleanedQuotes = quoteMap[percent];
        cleanedQuoteMap[percent] = [];
        for (const { edgesPoolAddrs: hopPoolAddrs, calculatedEdgeQuotes: calculatedHops, path, } of uncleanedQuotes) {
            // If the route was successful at each step, add it to the clean quote stack
            const filteredCalculatedEdges = calculatedHops.flatMap((val) => !!val && val.success ? val : []);
            if (filteredCalculatedEdges.length === hopPoolAddrs.length) {
                const [input, output] = [
                    filteredCalculatedEdges[0].amountIn,
                    filteredCalculatedEdges[filteredCalculatedEdges.length - 1].amountOut,
                ];
                cleanedQuoteMap[percent].push({
                    path,
                    splitPercent: percent,
                    edgesPoolAddrs: hopPoolAddrs,
                    amountIn: input,
                    amountOut: output,
                    calculatedEdgeQuotes: filteredCalculatedEdges,
                });
                continue;
            }
            // If a route failed, there would only be one failure
            const quoteFailures = calculatedHops.flatMap((f) => (f && !f?.success ? f : []));
            failureErrors.add(quoteFailures[0].error);
        }
    }
    // Prune the quote map to only include the top N quotes
    const prunedQuoteMap = {};
    const sortFn = amountSpecifiedIsInput
        ? (a, b) => b.amountOut.cmp(a.amountOut)
        : (a, b) => a.amountIn.cmp(b.amountIn);
    for (let i = 0; i < percents.length; i++) {
        const sortedQuotes = cleanedQuoteMap[percents[i]].sort(sortFn);
        const slicedSorted = sortedQuotes.slice(0, pruneN);
        prunedQuoteMap[percents[i]] = slicedSorted;
    }
    return [prunedQuoteMap, failureErrors];
}
function getSplitPercentageAmts(inputAmount, minPercent = 5) {
    const percents = [];
    const amounts = [];
    for (let i = 1; i <= 100 / minPercent; i++) {
        percents.push(i * minPercent);
        amounts.push(inputAmount.mul(new bn_js_1.default(i * minPercent)).div(new bn_js_1.default(100)));
    }
    return { percents, amounts };
}

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WhirlpoolRouterImpl = void 0;
const common_sdk_1 = require("@orca-so/common-sdk");
const errors_1 = require("../errors/errors");
const swap_with_route_1 = require("../instructions/composites/swap-with-route");
const fetcher_1 = require("../network/public/fetcher");
const public_1 = require("../utils/public");
const convert_quote_map_1 = require("./convert-quote-map");
const public_2 = require("./public");
const quote_map_1 = require("./quote-map");
class WhirlpoolRouterImpl {
    constructor(ctx, poolGraph) {
        this.ctx = ctx;
        this.poolGraph = poolGraph;
    }
    async findAllRoutes(trade, opts, fetchOpts) {
        const { tokenIn, tokenOut, tradeAmount, amountSpecifiedIsInput } = trade;
        const paths = this.poolGraph.getPath(tokenIn, tokenOut);
        if (paths.length === 0) {
            return Promise.reject(new errors_1.WhirlpoolsError(`Could not find route for ${tokenIn} -> ${tokenOut}`, errors_1.RouteQueryErrorCode.RouteDoesNotExist));
        }
        if (tradeAmount.isZero()) {
            return Promise.reject(new errors_1.WhirlpoolsError(`findBestRoutes error - input amount is zero.`, errors_1.RouteQueryErrorCode.ZeroInputAmount));
        }
        const routingOptions = { ...public_2.RouterUtils.getDefaultRouteOptions(), ...opts };
        const { program, fetcher } = this.ctx;
        const programId = program.programId;
        await prefetchRoutes(paths, programId, fetcher, fetchOpts);
        try {
            const [quoteMap, failures] = await (0, quote_map_1.getQuoteMap)(trade, paths, amountSpecifiedIsInput, programId, fetcher, routingOptions);
            const bestRoutes = (0, convert_quote_map_1.getBestRoutesFromQuoteMap)(quoteMap, amountSpecifiedIsInput, routingOptions);
            // TODO: Rudementary implementation to determine error. Find a better solution
            if (bestRoutes.length === 0) {
                // TODO: TRADE_AMOUNT_TOO_HIGH actually corresponds to TickArrayCrossingAboveMax. Fix swap quote.
                if (failures.has(errors_1.SwapErrorCode.TickArraySequenceInvalid)) {
                    return Promise.reject(new errors_1.WhirlpoolsError(`All swap quote generation failed on amount too high.`, errors_1.RouteQueryErrorCode.TradeAmountTooHigh));
                }
            }
            return bestRoutes;
        }
        catch (e) {
            return Promise.reject(new errors_1.WhirlpoolsError(`Stack error received on quote generation.`, errors_1.RouteQueryErrorCode.General, e.stack));
        }
    }
    async findBestRoute(trade, routingOpts, selectionOpts, fetchOpts) {
        const allRoutes = await this.findAllRoutes(trade, routingOpts, fetchOpts);
        const selectOpts = { ...public_2.RouterUtils.getDefaultSelectOptions(), ...selectionOpts };
        return await public_2.RouterUtils.selectFirstExecutableRoute(this.ctx, allRoutes, selectOpts);
    }
    async swap(trade, slippage, resolvedAtas) {
        const txBuilder = await (0, swap_with_route_1.getSwapFromRoute)(this.ctx, {
            route: trade,
            slippage,
            resolvedAtaAccounts: resolvedAtas,
            wallet: this.ctx.wallet.publicKey,
        }, fetcher_1.IGNORE_CACHE);
        return txBuilder;
    }
}
exports.WhirlpoolRouterImpl = WhirlpoolRouterImpl;
// Load all pool and tick-array data into the fetcher cache.
async function prefetchRoutes(paths, programId, fetcher, opts = fetcher_1.PREFER_CACHE) {
    const poolSet = new Set();
    for (let i = 0; i < paths.length; i++) {
        const path = paths[i];
        for (let j = 0; j < path.edges.length; j++) {
            poolSet.add(common_sdk_1.AddressUtil.toString(path.edges[j].poolAddress));
        }
    }
    const ps = Array.from(poolSet);
    const allWps = await fetcher.getPools(ps, opts);
    const tickArrayAddresses = [];
    for (const [key, wp] of allWps) {
        if (wp == null) {
            continue;
        }
        const addr1 = public_1.SwapUtils.getTickArrayPublicKeys(wp.tickCurrentIndex, wp.tickSpacing, true, common_sdk_1.AddressUtil.toPubKey(programId), common_sdk_1.AddressUtil.toPubKey(key));
        const addr2 = public_1.SwapUtils.getTickArrayPublicKeys(wp.tickCurrentIndex, wp.tickSpacing, false, common_sdk_1.AddressUtil.toPubKey(programId), common_sdk_1.AddressUtil.toPubKey(key));
        const allAddrs = [...addr1, ...addr2].map((k) => k.toBase58());
        const unique = Array.from(new Set(allAddrs));
        tickArrayAddresses.push(...unique);
    }
    await fetcher.getTickArrays(tickArrayAddresses, opts);
}

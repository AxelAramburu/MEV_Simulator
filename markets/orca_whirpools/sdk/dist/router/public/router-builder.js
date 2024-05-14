"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WhirlpoolRouterBuilder = void 0;
const public_1 = require("../../utils/public");
const router_impl_1 = require("../router-impl");
/**
 * Builder to build instances of the {@link WhirlpoolRouter}
 * @category Router
 */
class WhirlpoolRouterBuilder {
    /**
     * Builds a {@link WhirlpoolRouter} with a prebuilt {@link PoolGraph}
     *
     * @param ctx A {@link WhirlpoolContext} for the current execution environment
     * @param graph A {@link PoolGraph} that represents the connections between all pools.
     * @returns A {@link WhirlpoolRouter} that can be used to find routes and execute swaps
     */
    static buildWithPoolGraph(ctx, graph) {
        return new router_impl_1.WhirlpoolRouterImpl(ctx, graph);
    }
    /**
     * Fetch and builds a {@link WhirlpoolRouter} with a list of pool addresses.
     * @param ctx A {@link WhirlpoolContext} for the current execution environment
     * @param pools A list of {@link Address}es that the router will find routes through.
     * @returns A {@link WhirlpoolRouter} that can be used to find routes and execute swaps
     */
    static async buildWithPools(ctx, pools) {
        const poolGraph = await public_1.PoolGraphBuilder.buildPoolGraphWithFetch(pools, ctx.fetcher);
        return new router_impl_1.WhirlpoolRouterImpl(ctx, poolGraph);
    }
}
exports.WhirlpoolRouterBuilder = WhirlpoolRouterBuilder;

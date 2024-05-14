"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PoolGraphBuilder = void 0;
const fetcher_1 = require("../../../network/public/fetcher");
const adjacency_list_pool_graph_1 = require("../adjacency-list-pool-graph");
/**
 * A builder class for creating a {@link PoolGraph}
 *
 * Note: we use an adjacency list as a representation of our pool graph,
 * since we assume that most token pairings don't exist as pools
 * @category PoolGraph
 */
class PoolGraphBuilder {
    /**
     * Fetch data and build a {@link PoolGraph} from a list of pools addresses
     * @param pools - a list of pool addresses to generate this pool graph
     * @param cache - {@link WhirlpoolAccountFetcherInterface} to use for fetching pool data
     * @returns A {@link PoolGraph} with the provided pools
     */
    static async buildPoolGraphWithFetch(pools, fetcher) {
        const poolAccounts = await fetcher.getPools(pools, fetcher_1.PREFER_CACHE);
        const poolTokenPairs = Array.from(poolAccounts.entries())
            .map(([addr, pool]) => {
            if (pool) {
                return {
                    address: addr,
                    tokenMintA: pool.tokenMintA,
                    tokenMintB: pool.tokenMintB,
                };
            }
            return null;
        })
            .flatMap((pool) => (pool ? pool : []));
        return new adjacency_list_pool_graph_1.AdjacencyListPoolGraph(poolTokenPairs);
    }
    /**
     * Build a {@link PoolGraph} from a list of pools in the format of {@link PoolTokenPair}
     * @param poolTokenPairs - a list of {@link PoolTokenPair} to generate this pool graph
     * @returns A {@link PoolGraph} with the provided pools
     */
    static buildPoolGraph(poolTokenPairs) {
        return new adjacency_list_pool_graph_1.AdjacencyListPoolGraph(poolTokenPairs);
    }
}
exports.PoolGraphBuilder = PoolGraphBuilder;

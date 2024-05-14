import { Address } from "@coral-xyz/anchor";
import { WhirlpoolAccountFetcherInterface } from "../../../network/public/fetcher";
import { PoolGraph, PoolTokenPair } from "./pool-graph";
/**
 * A builder class for creating a {@link PoolGraph}
 *
 * Note: we use an adjacency list as a representation of our pool graph,
 * since we assume that most token pairings don't exist as pools
 * @category PoolGraph
 */
export declare class PoolGraphBuilder {
    /**
     * Fetch data and build a {@link PoolGraph} from a list of pools addresses
     * @param pools - a list of pool addresses to generate this pool graph
     * @param cache - {@link WhirlpoolAccountFetcherInterface} to use for fetching pool data
     * @returns A {@link PoolGraph} with the provided pools
     */
    static buildPoolGraphWithFetch(pools: Address[], fetcher: WhirlpoolAccountFetcherInterface): Promise<PoolGraph>;
    /**
     * Build a {@link PoolGraph} from a list of pools in the format of {@link PoolTokenPair}
     * @param poolTokenPairs - a list of {@link PoolTokenPair} to generate this pool graph
     * @returns A {@link PoolGraph} with the provided pools
     */
    static buildPoolGraph(poolTokenPairs: PoolTokenPair[]): PoolGraph;
}

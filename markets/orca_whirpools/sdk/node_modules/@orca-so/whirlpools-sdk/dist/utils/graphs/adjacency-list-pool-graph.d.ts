import { Address } from "@coral-xyz/anchor";
import { Path, PathSearchEntries, PathSearchOptions, PoolGraph, PoolTokenPair } from "./public/pool-graph";
/**
 * A pool graph implementation using an adjacency list.
 *
 * Whirlpools (Pools (edges) & Tokens (nodes)) are sparse graphs concentrated on popular pairs such as SOL, USDC etc.
 * Therefore this implementation is more efficient in memory consumption & building than a matrix.
 *
 * TODO: This implementation does not support 2-edge paths between identical tokens.
 */
export declare class AdjacencyListPoolGraph implements PoolGraph {
    readonly graph: Readonly<AdjacencyPoolGraphMap>;
    readonly tokens: Readonly<Address[]>;
    constructor(pools: PoolTokenPair[]);
    getPath(startMint: Address, endMint: Address, options?: PathSearchOptions): Path[];
    getPathsForPairs(searchTokenPairs: [Address, Address][], options?: PathSearchOptions): PathSearchEntries;
    getAllPaths(options?: PathSearchOptions | undefined): PathSearchEntries;
}
type AdjacencyPoolGraphMap = Record<string, readonly PoolGraphEdge[]>;
type PoolGraphEdge = {
    address: string;
    otherToken: string;
};
export {};

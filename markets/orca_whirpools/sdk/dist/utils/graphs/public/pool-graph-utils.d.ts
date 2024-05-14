import { Address } from "@coral-xyz/anchor";
/**
 * A utility class for working with pool graphs
 * @category PoolGraph
 */
export declare class PoolGraphUtils {
    static readonly PATH_ID_DELIMITER = "-";
    /**
     * Get a search path id from two tokens. The id can be used to identify a path between the two tokens in {@link PathSearchEntries}.
     * @param tokenA The first token in the path
     * @param tokenB The second token in the path
     * @returns A path id that can be used to identify a path between the two tokens in {@link PathSearchEntries}.
     */
    static getSearchPathId(tokenA: Address, tokenB: Address): string;
    /**
     * Deconstruct a path id into the two tokens it represents
     * @param pathId - The path id to deconstruct
     * @returns A tuple of the two tokens in the path id. Returns undefined if the provided pathId is invalid.
     */
    static deconstructPathId(pathId: string): readonly [string, string];
}

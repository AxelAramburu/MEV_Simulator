"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PoolGraphUtils = void 0;
const common_sdk_1 = require("@orca-so/common-sdk");
/**
 * A utility class for working with pool graphs
 * @category PoolGraph
 */
class PoolGraphUtils {
    /**
     * Get a search path id from two tokens. The id can be used to identify a path between the two tokens in {@link PathSearchEntries}.
     * @param tokenA The first token in the path
     * @param tokenB The second token in the path
     * @returns A path id that can be used to identify a path between the two tokens in {@link PathSearchEntries}.
     */
    static getSearchPathId(tokenA, tokenB) {
        return `${common_sdk_1.AddressUtil.toString(tokenA)}${PoolGraphUtils.PATH_ID_DELIMITER}${common_sdk_1.AddressUtil.toString(tokenB)}`;
    }
    /**
     * Deconstruct a path id into the two tokens it represents
     * @param pathId - The path id to deconstruct
     * @returns A tuple of the two tokens in the path id. Returns undefined if the provided pathId is invalid.
     */
    static deconstructPathId(pathId) {
        const split = pathId.split(PoolGraphUtils.PATH_ID_DELIMITER);
        if (split.length !== 2) {
            throw new Error(`Invalid path id: ${pathId}`);
        }
        const [tokenA, tokenB] = split;
        return [tokenA, tokenB];
    }
}
exports.PoolGraphUtils = PoolGraphUtils;
PoolGraphUtils.PATH_ID_DELIMITER = "-";

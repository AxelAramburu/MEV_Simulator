"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdjacencyListPoolGraph = void 0;
const common_sdk_1 = require("@orca-so/common-sdk");
const pool_graph_utils_1 = require("./public/pool-graph-utils");
/**
 * A pool graph implementation using an adjacency list.
 *
 * Whirlpools (Pools (edges) & Tokens (nodes)) are sparse graphs concentrated on popular pairs such as SOL, USDC etc.
 * Therefore this implementation is more efficient in memory consumption & building than a matrix.
 *
 * TODO: This implementation does not support 2-edge paths between identical tokens.
 */
class AdjacencyListPoolGraph {
    constructor(pools) {
        const [adjacencyListGraphMap, insertedTokens] = buildPoolGraph(pools);
        this.graph = adjacencyListGraphMap;
        this.tokens = Array.from(insertedTokens);
    }
    getPath(startMint, endMint, options) {
        const results = this.getPathsForPairs([[startMint, endMint]], options);
        return results[0][1];
    }
    getPathsForPairs(searchTokenPairs, options) {
        const searchTokenPairsInString = searchTokenPairs.map(([startMint, endMint]) => {
            return [common_sdk_1.AddressUtil.toString(startMint), common_sdk_1.AddressUtil.toString(endMint)];
        });
        const searchTokenPairsToFind = searchTokenPairsInString.filter(([startMint, endMint]) => {
            return startMint !== endMint;
        });
        const walkMap = findWalks(searchTokenPairsToFind, this.graph, options?.intermediateTokens.map((token) => common_sdk_1.AddressUtil.toString(token)));
        const results = searchTokenPairsInString.map(([startMint, endMint]) => {
            const searchRouteId = pool_graph_utils_1.PoolGraphUtils.getSearchPathId(startMint, endMint);
            const [internalStartMint, internalEndMint] = [startMint, endMint].sort();
            const internalRouteId = getInternalRouteId(internalStartMint, internalEndMint, false);
            const reversed = internalStartMint !== startMint;
            const pathsForSearchPair = walkMap[internalRouteId];
            const paths = pathsForSearchPair
                ? pathsForSearchPair.map((path) => {
                    return {
                        startTokenMint: startMint,
                        endTokenMint: endMint,
                        edges: getHopsFromRoute(path, reversed),
                    };
                })
                : [];
            return [searchRouteId, paths];
        });
        return results;
    }
    getAllPaths(options) {
        const tokenPairCombinations = combinations2(this.tokens);
        const searchTokenPairsInString = tokenPairCombinations.map(([startMint, endMint]) => {
            return [startMint, endMint];
        });
        const searchTokenPairsToFind = searchTokenPairsInString.filter(([startMint, endMint]) => {
            return startMint !== endMint;
        });
        const walkMap = findWalks(searchTokenPairsToFind, this.graph, options?.intermediateTokens.map((token) => common_sdk_1.AddressUtil.toString(token)));
        // TODO: The token pairs are is in 1 direction only, we have to reverse them to get the other direction.
        // this is actually pretty slow.consider removing reversal optimization in findWalks
        const results = searchTokenPairsInString.reduce((acc, [startMint, endMint]) => {
            const searchRouteId = pool_graph_utils_1.PoolGraphUtils.getSearchPathId(startMint, endMint);
            // We do not support routes that routes between identical tokens
            if (startMint === endMint) {
                acc.push([searchRouteId, []]);
                return acc;
            }
            const [internalStartMint, internalEndMint] = [startMint, endMint].sort();
            const internalRouteId = getInternalRouteId(internalStartMint, internalEndMint, false);
            const reversed = internalStartMint !== startMint;
            const pathsForSearchPair = walkMap[internalRouteId];
            const paths = pathsForSearchPair
                ? pathsForSearchPair.map((path) => {
                    return {
                        startTokenMint: startMint,
                        endTokenMint: endMint,
                        edges: getHopsFromRoute(path, reversed),
                    };
                })
                : [];
            acc.push([searchRouteId, paths]);
            const reversedSearchRouteId = pool_graph_utils_1.PoolGraphUtils.getSearchPathId(endMint, startMint);
            const reversedPaths = pathsForSearchPair
                ? pathsForSearchPair.map((path) => {
                    return {
                        startTokenMint: endMint,
                        endTokenMint: startMint,
                        edges: getHopsFromRoute(path, !reversed),
                    };
                })
                : [];
            acc.push([reversedSearchRouteId, reversedPaths]);
            return acc;
        }, []);
        return results;
    }
}
exports.AdjacencyListPoolGraph = AdjacencyListPoolGraph;
function getHopsFromRoute(path, reversed) {
    const finalRoutes = reversed ? path.slice().reverse() : path;
    return finalRoutes.map((hopStr) => {
        return { poolAddress: hopStr };
    });
}
function buildPoolGraph(pools) {
    const insertedPoolCache = {};
    const insertedTokens = new Set();
    const poolGraphSet = pools.reduce((poolGraph, pool) => {
        const { address, tokenMintA, tokenMintB } = pool;
        const [addr, mintA, mintB] = common_sdk_1.AddressUtil.toStrings([address, tokenMintA, tokenMintB]);
        insertedTokens.add(mintA);
        insertedTokens.add(mintB);
        if (poolGraph[mintA] === undefined) {
            poolGraph[mintA] = [];
            insertedPoolCache[mintA] = new Set();
        }
        if (poolGraph[mintB] === undefined) {
            poolGraph[mintB] = [];
            insertedPoolCache[mintB] = new Set();
        }
        const [insertedPoolsForA, insertedPoolsForB] = [
            insertedPoolCache[mintA],
            insertedPoolCache[mintB],
        ];
        if (!insertedPoolsForA.has(addr)) {
            poolGraph[mintA].push({ address: addr, otherToken: mintB });
            insertedPoolsForA.add(addr);
        }
        if (!insertedPoolsForB.has(addr)) {
            poolGraph[mintB].push({ address: addr, otherToken: mintA });
            insertedPoolsForB.add(addr);
        }
        return poolGraph;
    }, {});
    return [poolGraphSet, insertedTokens];
}
// This is currently hardcoded to find walks of max length 2, generalizing to longer walks
// may mean that a adjacency matrix might have better performance
// NOTE: that this function does not support routing between the same token on hop length 2.
function findWalks(tokenPairs, poolGraph, intermediateTokens) {
    const walks = {};
    tokenPairs.forEach(([tokenMintFrom, tokenMintTo]) => {
        let paths = [];
        // Adjust walk's from & to token based of of internal path id.
        const [internalTokenMintFrom, internalTokenMintTo] = [tokenMintFrom, tokenMintTo].sort();
        const internalPathId = getInternalRouteId(internalTokenMintFrom, internalTokenMintTo, false);
        const poolsForTokenFrom = poolGraph[internalTokenMintFrom] || [];
        const poolsForTokenTo = poolGraph[internalTokenMintTo] || [];
        // If the internal path id has already been created, then there is no need to re-search the path.
        // Possible that the path was searched in reverse.
        if (!!walks[internalPathId]) {
            return;
        }
        // Find all direct pool paths, i.e. all edges shared between tokenA and tokenB
        const singleHop = poolsForTokenFrom
            .filter(({ address }) => poolsForTokenTo.some((p) => p.address === address))
            .map((op) => [op.address]);
        paths.push(...singleHop);
        // Remove all direct edges from poolA to poolB
        const firstHop = poolsForTokenFrom.filter(({ address }) => !poolsForTokenTo.some((p) => p.address === address));
        // Find all edges/nodes from neighbors of A that connect to B to create paths of length 2
        // tokenA --> tokenX --> tokenB
        firstHop.forEach((firstPool) => {
            const intermediateToken = firstPool.otherToken;
            if (!intermediateTokens || intermediateTokens.indexOf(intermediateToken) > -1) {
                const secondHops = poolsForTokenTo
                    .filter((secondPool) => secondPool.otherToken === intermediateToken)
                    .map((secondPool) => [firstPool.address, secondPool.address]);
                paths.push(...secondHops);
            }
        });
        if (paths.length > 0) {
            walks[internalPathId] = paths;
        }
    });
    return walks;
}
function getInternalRouteId(tokenA, tokenB, sort = true) {
    const mints = [common_sdk_1.AddressUtil.toString(tokenA), common_sdk_1.AddressUtil.toString(tokenB)];
    const sortedMints = sort ? mints.sort() : mints;
    return `${sortedMints[0]}${pool_graph_utils_1.PoolGraphUtils.PATH_ID_DELIMITER}${sortedMints[1]}`;
}
// equivalent to lodash.combinations(array, 2)
function combinations2(array) {
    const result = [];
    for (let i = 0; i < array.length - 1; i++) {
        for (let j = i + 1; j < array.length; j++) {
            result.push([array[i], array[j]]);
        }
    }
    return result;
}

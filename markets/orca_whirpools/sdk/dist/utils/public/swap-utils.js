"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SwapUtils = void 0;
const common_sdk_1 = require("@orca-so/common-sdk");
const bn_js_1 = __importDefault(require("bn.js"));
const public_1 = require("../../types/public");
const token_math_1 = require("../math/token-math");
const pda_utils_1 = require("./pda-utils");
const pool_utils_1 = require("./pool-utils");
const tick_utils_1 = require("./tick-utils");
const types_1 = require("./types");
/**
 * @category Whirlpool Utils
 */
class SwapUtils {
    /**
     * Get the default values for the sqrtPriceLimit parameter in a swap.
     * @param aToB - The direction of a swap
     * @returns The default values for the sqrtPriceLimit parameter in a swap.
     */
    static getDefaultSqrtPriceLimit(aToB) {
        return new bn_js_1.default(aToB ? public_1.MIN_SQRT_PRICE : public_1.MAX_SQRT_PRICE);
    }
    /**
     * Get the default values for the otherAmountThreshold parameter in a swap.
     * @param amountSpecifiedIsInput - The direction of a swap
     * @returns The default values for the otherAmountThreshold parameter in a swap.
     */
    static getDefaultOtherAmountThreshold(amountSpecifiedIsInput) {
        return amountSpecifiedIsInput ? common_sdk_1.ZERO : common_sdk_1.U64_MAX;
    }
    /**
     * Given the intended token mint to swap, return the swap direction of a swap for a Whirlpool
     * @param pool The Whirlpool to evaluate the mint against
     * @param swapTokenMint The token mint PublicKey the user bases their swap against
     * @param swapTokenIsInput Whether the swap token is the input token. (similar to amountSpecifiedIsInput from swap Ix)
     * @returns The direction of the swap given the swapTokenMint. undefined if the token mint is not part of the trade pair of the pool.
     */
    static getSwapDirection(pool, swapTokenMint, swapTokenIsInput) {
        const tokenType = pool_utils_1.PoolUtil.getTokenType(pool, swapTokenMint);
        if (!tokenType) {
            return undefined;
        }
        return (tokenType === types_1.TokenType.TokenA) === swapTokenIsInput
            ? types_1.SwapDirection.AtoB
            : types_1.SwapDirection.BtoA;
    }
    /**
     * Given the current tick-index, returns the dervied PDA and fetched data
     * for the tick-arrays that this swap may traverse across.
     *
     * @category Whirlpool Utils
     * @param tickCurrentIndex - The current tickIndex for the Whirlpool to swap on.
     * @param tickSpacing - The tickSpacing for the Whirlpool.
     * @param aToB - The direction of the trade.
     * @param programId - The Whirlpool programId which the Whirlpool lives on.
     * @param whirlpoolAddress - PublicKey of the whirlpool to swap on.
     * @returns An array of PublicKey[] for the tickArray accounts that this swap may traverse across.
     */
    static getTickArrayPublicKeys(tickCurrentIndex, tickSpacing, aToB, programId, whirlpoolAddress) {
        const shift = aToB ? 0 : tickSpacing;
        let offset = 0;
        let tickArrayAddresses = [];
        for (let i = 0; i < public_1.MAX_SWAP_TICK_ARRAYS; i++) {
            let startIndex;
            try {
                startIndex = tick_utils_1.TickUtil.getStartTickIndex(tickCurrentIndex + shift, tickSpacing, offset);
            }
            catch {
                return tickArrayAddresses;
            }
            const pda = pda_utils_1.PDAUtil.getTickArray(programId, whirlpoolAddress, startIndex);
            tickArrayAddresses.push(pda.publicKey);
            offset = aToB ? offset - 1 : offset + 1;
        }
        return tickArrayAddresses;
    }
    /**
     * Given the current tick-index, returns TickArray objects that this swap may traverse across.
     *
     * @category Whirlpool Utils
     * @param tickCurrentIndex - The current tickIndex for the Whirlpool to swap on.
     * @param tickSpacing - The tickSpacing for the Whirlpool.
     * @param aToB - The direction of the trade.
     * @param programId - The Whirlpool programId which the Whirlpool lives on.
     * @param whirlpoolAddress - PublicKey of the whirlpool to swap on.
     * @param cache - WhirlpoolAccountCacheInterface object to fetch solana accounts
     * @param opts an {@link WhirlpoolAccountFetchOptions} object to define fetch and cache options when accessing on-chain accounts
     * @returns An array of PublicKey[] for the tickArray accounts that this swap may traverse across.
     */
    static async getTickArrays(tickCurrentIndex, tickSpacing, aToB, programId, whirlpoolAddress, fetcher, opts) {
        const data = await this.getBatchTickArrays(programId, fetcher, [{ tickCurrentIndex, tickSpacing, aToB, whirlpoolAddress }], opts);
        return data[0];
    }
    /**
     * Fetch a batch of tick-arrays for a set of TA requests.
     * @param programId - The Whirlpool programId which the Whirlpool lives on.
     * @param cache - WhirlpoolAccountCacheInterface instance to fetch solana accounts
     * @param tickArrayRequests - An array of {@link TickArrayRequest} of tick-arrays to request for.
     * @param opts an {@link WhirlpoolAccountFetchOptions} object to define fetch and cache options when accessing on-chain accounts
     * @returns A array of request indicies mapped to an array of resulting PublicKeys.
     */
    static async getBatchTickArrays(programId, fetcher, tickArrayRequests, opts) {
        let addresses = [];
        let requestToIndices = [];
        // Each individual tick array request may correspond to more than one tick array
        // so we map each request to a slice of the batch request
        for (let i = 0; i < tickArrayRequests.length; i++) {
            const { tickCurrentIndex, tickSpacing, aToB, whirlpoolAddress } = tickArrayRequests[i];
            const requestAddresses = SwapUtils.getTickArrayPublicKeys(tickCurrentIndex, tickSpacing, aToB, programId, whirlpoolAddress);
            requestToIndices.push([addresses.length, addresses.length + requestAddresses.length]);
            addresses.push(...requestAddresses);
        }
        const data = await fetcher.getTickArrays(addresses, opts);
        // Re-map from flattened batch data to TickArray[] for request
        return requestToIndices.map((indices) => {
            const [start, end] = indices;
            const addressSlice = addresses.slice(start, end);
            const dataSlice = data.slice(start, end);
            return addressSlice.map((addr, index) => ({
                address: addr,
                data: dataSlice[index],
            }));
        });
    }
    /**
     * Calculate the SwapInput parameters `amount` & `otherAmountThreshold` based on the amountIn & amountOut estimates from a quote.
     * @param amount - The amount of tokens the user wanted to swap from.
     * @param estAmountIn - The estimated amount of input tokens expected in a `SwapQuote`
     * @param estAmountOut - The estimated amount of output tokens expected from a `SwapQuote`
     * @param slippageTolerance - The amount of slippage to adjust for.
     * @param amountSpecifiedIsInput - Specifies the token the parameter `amount`represents in the swap quote. If true, the amount represents
     *                                 the input token of the swap.
     * @returns A Partial `SwapInput` object containing the slippage adjusted 'amount' & 'otherAmountThreshold' parameters.
     */
    static calculateSwapAmountsFromQuote(amount, estAmountIn, estAmountOut, slippageTolerance, amountSpecifiedIsInput) {
        if (amountSpecifiedIsInput) {
            return {
                amount,
                otherAmountThreshold: (0, token_math_1.adjustForSlippage)(estAmountOut, slippageTolerance, false),
            };
        }
        else {
            return {
                amount,
                otherAmountThreshold: (0, token_math_1.adjustForSlippage)(estAmountIn, slippageTolerance, true),
            };
        }
    }
    /**
     * Convert a quote object and WhirlpoolClient's {@link Whirlpool} object into a {@link SwapParams} type
     * to be plugged into {@link WhirlpoolIx.swapIx}.
     *
     * @param quote - A {@link SwapQuote} type generated from {@link swapQuoteWithParams}
     * @param ctx - {@link WhirlpoolContext}
     * @param whirlpool - A {@link Whirlpool} object from WhirlpoolClient
     * @param inputTokenAssociatedAddress - The public key for the ATA of the input token in the swap
     * @param outputTokenAssociatedAddress - The public key for the ATA of the input token in the swap
     * @param wallet - The token authority for this swap
     * @returns A converted {@link SwapParams} generated from the input
     */
    static getSwapParamsFromQuote(quote, ctx, whirlpool, inputTokenAssociatedAddress, outputTokenAssociatedAddress, wallet) {
        const data = whirlpool.getData();
        return this.getSwapParamsFromQuoteKeys(quote, ctx, whirlpool.getAddress(), data.tokenVaultA, data.tokenVaultB, inputTokenAssociatedAddress, outputTokenAssociatedAddress, wallet);
    }
    static getSwapParamsFromQuoteKeys(quote, ctx, whirlpool, tokenVaultA, tokenVaultB, inputTokenAssociatedAddress, outputTokenAssociatedAddress, wallet) {
        const aToB = quote.aToB;
        const [inputTokenATA, outputTokenATA] = common_sdk_1.AddressUtil.toPubKeys([
            inputTokenAssociatedAddress,
            outputTokenAssociatedAddress,
        ]);
        const oraclePda = pda_utils_1.PDAUtil.getOracle(ctx.program.programId, whirlpool);
        const params = {
            whirlpool,
            tokenOwnerAccountA: aToB ? inputTokenATA : outputTokenATA,
            tokenOwnerAccountB: aToB ? outputTokenATA : inputTokenATA,
            tokenVaultA,
            tokenVaultB,
            oracle: oraclePda.publicKey,
            tokenAuthority: wallet,
            ...quote,
        };
        return params;
    }
}
exports.SwapUtils = SwapUtils;

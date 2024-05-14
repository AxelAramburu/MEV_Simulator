"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.swapQuoteByInputTokenWithDevFees = void 0;
const errors_1 = require("../../errors/errors");
const swap_quote_1 = require("./swap-quote");
/**
 * Get an estimated swap quote using input token amount while collecting dev fees.
 *
 * @category Quotes
 * @param whirlpool - Whirlpool to perform the swap on
 * @param inputTokenMint - PublicKey for the input token mint to swap with
 * @param tokenAmount - The amount of input token to swap from
 * @param slippageTolerance - The amount of slippage to account for in this quote
 * @param programId - PublicKey for the Whirlpool ProgramId
 * @param cache - WhirlpoolAccountCacheInterface instance to fetch solana accounts
 * @param opts an {@link WhirlpoolAccountFetchOptions} object to define fetch and cache options when accessing on-chain accounts
 * @param devFeePercentage - The percentage amount to send to developer wallet prior to the swap. Percentage num/dem values has to match token decimal.
 * @returns a SwapQuote object with slippage adjusted SwapInput parameters & estimates on token amounts, fee & end whirlpool states.
 */
async function swapQuoteByInputTokenWithDevFees(whirlpool, inputTokenMint, tokenAmount, slippageTolerance, programId, fetcher, devFeePercentage, opts) {
    if (devFeePercentage.toDecimal().greaterThanOrEqualTo(1)) {
        throw new errors_1.WhirlpoolsError("Provided devFeePercentage must be less than 100%", errors_1.SwapErrorCode.InvalidDevFeePercentage);
    }
    const devFeeAmount = tokenAmount
        .mul(devFeePercentage.numerator)
        .div(devFeePercentage.denominator);
    const slippageAdjustedQuote = await (0, swap_quote_1.swapQuoteByInputToken)(whirlpool, inputTokenMint, tokenAmount.sub(devFeeAmount), slippageTolerance, programId, fetcher, opts);
    const devFeeAdjustedQuote = {
        ...slippageAdjustedQuote,
        amountSpecifiedIsInput: true,
        estimatedAmountIn: slippageAdjustedQuote.estimatedAmountIn.add(devFeeAmount),
        estimatedFeeAmount: slippageAdjustedQuote.estimatedFeeAmount.add(devFeeAmount),
        estimatedSwapFeeAmount: slippageAdjustedQuote.estimatedFeeAmount,
        devFeeAmount,
    };
    return devFeeAdjustedQuote;
}
exports.swapQuoteByInputTokenWithDevFees = swapQuoteByInputTokenWithDevFees;

import { Address } from "@coral-xyz/anchor";
import { Percentage } from "@orca-so/common-sdk";
import BN from "bn.js";
import { WhirlpoolAccountFetchOptions, WhirlpoolAccountFetcherInterface } from "../../network/public/fetcher";
import { Whirlpool } from "../../whirlpool-client";
import { NormalSwapQuote } from "./swap-quote";
/**
 * A collection of estimated values from quoting a swap that collects a developer-fee.
 * @category Quotes
 * @param estimatedAmountIn - Approximate number of input token swapped in the swap
 * @param estimatedAmountOut - Approximate number of output token swapped in the swap
 * @param estimatedEndTickIndex - Approximate tick-index the Whirlpool will land on after this swap
 * @param estimatedEndSqrtPrice - Approximate sqrtPrice the Whirlpool will land on after this swap
 * @param estimatedFeeAmount - Approximate feeAmount (all fees) charged on this swap
 * @param estimatedSwapFeeAmount - Approximate feeAmount (LP + protocol fees) charged on this swap
 * @param devFeeAmount -  FeeAmount (developer fees) charged on this swap
 */
export type DevFeeSwapQuote = NormalSwapQuote & {
    amountSpecifiedIsInput: true;
    estimatedSwapFeeAmount: BN;
    devFeeAmount: BN;
};
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
export declare function swapQuoteByInputTokenWithDevFees(whirlpool: Whirlpool, inputTokenMint: Address, tokenAmount: BN, slippageTolerance: Percentage, programId: Address, fetcher: WhirlpoolAccountFetcherInterface, devFeePercentage: Percentage, opts?: WhirlpoolAccountFetchOptions): Promise<DevFeeSwapQuote>;

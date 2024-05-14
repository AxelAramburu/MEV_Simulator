import { Address } from "@coral-xyz/anchor";
import { Percentage } from "@orca-so/common-sdk";
import { PublicKey } from "@solana/web3.js";
import BN from "bn.js";
import Decimal from "decimal.js";
import { IncreaseLiquidityInput } from "../../instructions";
import { Whirlpool } from "../../whirlpool-client";
/*** --------- Quote by Input Token --------- ***/
/**
 * @category Quotes
 * @param inputTokenAmount - The amount of input tokens to deposit.
 * @param inputTokenMint - The mint of the input token the user would like to deposit.
 * @param tokenMintA - The mint of tokenA in the Whirlpool the user is depositing into.
 * @param tokenMintB -The mint of tokenB in the Whirlpool the user is depositing into.
 * @param tickCurrentIndex - The Whirlpool's current tickIndex
 * @param sqrtPrice - The Whirlpool's current sqrtPrice
 * @param tickLowerIndex - The lower index of the position that we are withdrawing from.
 * @param tickUpperIndex - The upper index of the position that we are withdrawing from.
 * @param slippageTolerance - The maximum slippage allowed when calculating the minimum tokens received.
 */
export type IncreaseLiquidityQuoteParam = {
    inputTokenAmount: BN;
    inputTokenMint: PublicKey;
    tokenMintA: PublicKey;
    tokenMintB: PublicKey;
    tickCurrentIndex: number;
    sqrtPrice: BN;
    tickLowerIndex: number;
    tickUpperIndex: number;
    slippageTolerance: Percentage;
};
/**
 * Return object from increase liquidity quote functions.
 * @category Quotes
 */
export type IncreaseLiquidityQuote = IncreaseLiquidityInput & IncreaseLiquidityEstimate;
type IncreaseLiquidityEstimate = {
    liquidityAmount: BN;
    tokenEstA: BN;
    tokenEstB: BN;
};
/**
 * Get an estimated quote on the maximum tokens required to deposit based on a specified input token amount.
 * This new version calculates slippage based on price percentage movement, rather than setting the percentage threshold based on token estimates.
 *
 * @category Quotes
 * @param inputTokenAmount - The amount of input tokens to deposit.
 * @param inputTokenMint - The mint of the input token the user would like to deposit.
 * @param tickLower - The lower index of the position that we are depositing into.
 * @param tickUpper - The upper index of the position that we are depositing into.
 * @param slippageTolerance - The maximum slippage allowed when calculating the minimum tokens received.
 * @param whirlpool - A Whirlpool helper class to help interact with the Whirlpool account.
 * @returns An IncreaseLiquidityInput object detailing the required token amounts & liquidity values to use when calling increase-liquidity-ix.
 */
export declare function increaseLiquidityQuoteByInputTokenUsingPriceSlippage(inputTokenMint: Address, inputTokenAmount: Decimal, tickLower: number, tickUpper: number, slippageTolerance: Percentage, whirlpool: Whirlpool): IncreaseLiquidityQuote;
/**
 * Get an estimated quote on the maximum tokens required to deposit based on a specified input token amount.
 * This new version calculates slippage based on price percentage movement, rather than setting the percentage threshold based on token estimates.
 *
 * @category Quotes
 * @param param IncreaseLiquidityQuoteParam
 * @returns An IncreaseLiquidityInput object detailing the required token amounts & liquidity values to use when calling increase-liquidity-ix.
 */
export declare function increaseLiquidityQuoteByInputTokenWithParamsUsingPriceSlippage(param: IncreaseLiquidityQuoteParam): IncreaseLiquidityQuote;
/*** --------- Quote by Liquidity --------- ***/
/**
 * @category Quotes
 * @param liquidity - The amount of liquidity value to deposit into the Whirlpool.
 * @param tokenMintA - The mint of tokenA in the Whirlpool the user is depositing into.
 * @param tokenMintB -The mint of tokenB in the Whirlpool the user is depositing into.
 * @param tickCurrentIndex - The Whirlpool's current tickIndex
 * @param sqrtPrice - The Whirlpool's current sqrtPrice
 * @param tickLowerIndex - The lower index of the position that we are withdrawing from.
 * @param tickUpperIndex - The upper index of the position that we are withdrawing from.
 * @param slippageTolerance - The maximum slippage allowed when calculating the minimum tokens received.
 */
export type IncreaseLiquidityQuoteByLiquidityParam = {
    liquidity: BN;
    tickCurrentIndex: number;
    sqrtPrice: BN;
    tickLowerIndex: number;
    tickUpperIndex: number;
    slippageTolerance: Percentage;
};
export declare function increaseLiquidityQuoteByLiquidityWithParams(params: IncreaseLiquidityQuoteByLiquidityParam): IncreaseLiquidityQuote;
/*** --------- Deprecated --------- ***/
/**
 * Get an estimated quote on the maximum tokens required to deposit based on a specified input token amount.
 *
 * @category Quotes
 * @param inputTokenAmount - The amount of input tokens to deposit.
 * @param inputTokenMint - The mint of the input token the user would like to deposit.
 * @param tickLower - The lower index of the position that we are withdrawing from.
 * @param tickUpper - The upper index of the position that we are withdrawing from.
 * @param slippageTolerance - The maximum slippage allowed when calculating the minimum tokens received.
 * @param whirlpool - A Whirlpool helper class to help interact with the Whirlpool account.
 * @returns An IncreaseLiquidityInput object detailing the required token amounts & liquidity values to use when calling increase-liquidity-ix.
 * @deprecated Use increaseLiquidityQuoteByInputTokenUsingPriceSlippage instead.
 */
export declare function increaseLiquidityQuoteByInputToken(inputTokenMint: Address, inputTokenAmount: Decimal, tickLower: number, tickUpper: number, slippageTolerance: Percentage, whirlpool: Whirlpool): IncreaseLiquidityQuote;
/**
 * Get an estimated quote on the maximum tokens required to deposit based on a specified input token amount.
 *
 * @category Quotes
 * @param param IncreaseLiquidityQuoteParam
 * @returns An IncreaseLiquidityInput object detailing the required token amounts & liquidity values to use when calling increase-liquidity-ix.
 * @deprecated Use increaseLiquidityQuoteByInputTokenWithParams_PriceSlippage instead.
 */
export declare function increaseLiquidityQuoteByInputTokenWithParams(param: IncreaseLiquidityQuoteParam): IncreaseLiquidityQuote;
export {};

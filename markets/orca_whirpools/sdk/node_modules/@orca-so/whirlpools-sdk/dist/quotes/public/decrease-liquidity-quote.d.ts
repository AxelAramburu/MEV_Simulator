/// <reference types="bn.js" />
import { BN } from "@coral-xyz/anchor";
import { Percentage } from "@orca-so/common-sdk";
import { DecreaseLiquidityInput } from "../../instructions";
import { Position, Whirlpool } from "../../whirlpool-client";
/**
 * @category Quotes
 * @param liquidity - The desired liquidity to withdraw from the Whirlpool
 * @param tickCurrentIndex - The Whirlpool's current tickIndex
 * @param sqrtPrice - The Whirlpool's current sqrtPrice
 * @param tickLowerIndex - The lower index of the position that we are withdrawing from.
 * @param tickUpperIndex - The upper index of the position that we are withdrawing from.
 * @param slippageTolerance - The maximum slippage allowed when calculating the minimum tokens received.
 */
export type DecreaseLiquidityQuoteParam = {
    liquidity: BN;
    tickCurrentIndex: number;
    sqrtPrice: BN;
    tickLowerIndex: number;
    tickUpperIndex: number;
    slippageTolerance: Percentage;
};
/**
 * Return object from decrease liquidity quote functions.
 * @category Quotes
 */
export type DecreaseLiquidityQuote = DecreaseLiquidityInput & {
    tokenEstA: BN;
    tokenEstB: BN;
};
/**
 * Get an estimated quote on the minimum tokens receivable based on the desired withdraw liquidity value.
 *
 * @category Quotes
 * @param liquidity - The desired liquidity to withdraw from the Whirlpool
 * @param slippageTolerance - The maximum slippage allowed when calculating the minimum tokens received.
 * @param position - A Position helper class to help interact with the Position account.
 * @param whirlpool - A Whirlpool helper class to help interact with the Whirlpool account.
 * @returns An DecreaseLiquidityQuote object detailing the tokenMin & liquidity values to use when calling decrease-liquidity-ix.
 */
export declare function decreaseLiquidityQuoteByLiquidity(liquidity: BN, slippageTolerance: Percentage, position: Position, whirlpool: Whirlpool): DecreaseLiquidityQuote;
/**
 * Get an estimated quote on the minimum tokens receivable based on the desired withdraw liquidity value.
 *
 * @category Quotes
 * @param param DecreaseLiquidityQuoteParam
 * @returns An DecreaseLiquidityInput object detailing the tokenMin & liquidity values to use when calling decrease-liquidity-ix.
 */
export declare function decreaseLiquidityQuoteByLiquidityWithParams(param: DecreaseLiquidityQuoteParam): DecreaseLiquidityQuote;

/// <reference types="bn.js" />
import { BN } from "@coral-xyz/anchor";
import { Percentage } from "@orca-so/common-sdk";
export declare enum SwapDirection {
    AtoB = "Swap A to B",
    BtoA = "Swap B to A"
}
export declare enum AmountSpecified {
    Input = "Specified input amount",
    Output = "Specified output amount"
}
export declare enum PositionStatus {
    BelowRange = 0,
    InRange = 1,
    AboveRange = 2
}
export declare class PositionUtil {
    private constructor();
    /**
     * Returns the position status of a given tickCurrentIndex in relation to the tickLowerIndex and tickUpperIndex.
     * If the tickCurrentIndex is below the range, it returns PositionStatus.BelowRange.
     * If the tickCurrentIndex is above the range, it returns PositionStatus.AboveRange.
     * If the tickCurrentIndex is equal to the lower, PositionStatus.InRange is returned.
     * On the other hand, if the tickCurrentIndex is equal to the upper, PositionStatus.AboveRange is returned.
     * The relation "PriceMath.tickIndexToSqrtPriceX64(tickCurrentIndex) <= pool's sqrtPrice" is the reason.
     *
     * @param tickCurrentIndex - Whirlpool's current tick index.
     * @param tickLowerIndex - The tick specifying the lower end of the position range.
     * @param tickUpperIndex - The tick specifying the upper end of the position range.
     * @returns Position status in the form of PositionStatus enum.
     */
    static getPositionStatus(tickCurrentIndex: number, tickLowerIndex: number, tickUpperIndex: number): PositionStatus;
    /**
     * Returns the position status of a given sqrtPriceX64 in relation to the tickLowerIndex and tickUpperIndex.
     * If the sqrtPriceX64 is below the range, it returns PositionStatus.BelowRange.
     * If the sqrtPriceX64 is above the range, it returns PositionStatus.AboveRange.
     * If the sqrtPriceX64 is equal to the lower or upper, PositionStatus.BelowRange or PositionStatus.AboveRange is returned respectively.
     *
     * @param sqrtPriceX64 - X64 representation of the square root of the price.
     * @param tickLowerIndex - The tick specifying the lower end of the position range.
     * @param tickUpperIndex - The tick specifying the upper end of the position range.
     * @returns Position status in the form of PositionStatus enum.
     */
    static getStrictPositionStatus(sqrtPriceX64: BN, tickLowerIndex: number, tickUpperIndex: number): PositionStatus;
}
export declare function adjustForSlippage(n: BN, { numerator, denominator }: Percentage, adjustUp: boolean): BN;
export declare function adjustAmountForSlippage(amountIn: BN, amountOut: BN, { numerator, denominator }: Percentage, amountSpecified: AmountSpecified): BN;
export declare function getLiquidityFromTokenA(amount: BN, sqrtPriceLowerX64: BN, sqrtPriceUpperX64: BN, roundUp: boolean): BN;
export declare function getLiquidityFromTokenB(amount: BN, sqrtPriceLowerX64: BN, sqrtPriceUpperX64: BN, roundUp: boolean): BN;
export declare function getAmountFixedDelta(currentSqrtPriceX64: BN, targetSqrtPriceX64: BN, liquidity: BN, amountSpecified: AmountSpecified, swapDirection: SwapDirection): BN;
export declare function getAmountUnfixedDelta(currentSqrtPriceX64: BN, targetSqrtPriceX64: BN, liquidity: BN, amountSpecified: AmountSpecified, swapDirection: SwapDirection): BN;
export declare function getNextSqrtPrice(sqrtPriceX64: BN, liquidity: BN, amount: BN, amountSpecified: AmountSpecified, swapDirection: SwapDirection): BN;
export declare function getTokenAFromLiquidity(liquidity: BN, sqrtPrice0X64: BN, sqrtPrice1X64: BN, roundUp: boolean): BN;
export declare function getTokenBFromLiquidity(liquidity: BN, sqrtPrice0X64: BN, sqrtPrice1X64: BN, roundUp: boolean): BN;

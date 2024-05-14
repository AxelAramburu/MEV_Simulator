/// <reference types="bn.js" />
import { BN } from "@coral-xyz/anchor";
import { Percentage } from "@orca-so/common-sdk";
import Decimal from "decimal.js";
/**
 * A collection of utility functions to convert between price, tickIndex and sqrtPrice.
 *
 * @category Whirlpool Utils
 */
export declare class PriceMath {
    static priceToSqrtPriceX64(price: Decimal, decimalsA: number, decimalsB: number): BN;
    static sqrtPriceX64ToPrice(sqrtPriceX64: BN, decimalsA: number, decimalsB: number): Decimal;
    /**
     * @param tickIndex
     * @returns
     */
    static tickIndexToSqrtPriceX64(tickIndex: number): BN;
    /**
     *
     * @param sqrtPriceX64
     * @returns
     */
    static sqrtPriceX64ToTickIndex(sqrtPriceX64: BN): number;
    static tickIndexToPrice(tickIndex: number, decimalsA: number, decimalsB: number): Decimal;
    static priceToTickIndex(price: Decimal, decimalsA: number, decimalsB: number): number;
    static priceToInitializableTickIndex(price: Decimal, decimalsA: number, decimalsB: number, tickSpacing: number): number;
    /**
     * Utility to invert the price Pb/Pa to Pa/Pb
     * NOTE: precision is lost in this conversion
     *
     * @param price Pb / Pa
     * @param decimalsA Decimals of original token A (i.e. token A in the given Pb / Pa price)
     * @param decimalsB Decimals of original token B (i.e. token B in the given Pb / Pa price)
     * @returns inverted price, i.e. Pa / Pb
     */
    static invertPrice(price: Decimal, decimalsA: number, decimalsB: number): Decimal;
    /**
     * Utility to invert the sqrtPriceX64 from X64 repr. of sqrt(Pb/Pa) to X64 repr. of sqrt(Pa/Pb)
     * NOTE: precision is lost in this conversion
     *
     * @param sqrtPriceX64 X64 representation of sqrt(Pb / Pa)
     * @returns inverted sqrtPriceX64, i.e. X64 representation of sqrt(Pa / Pb)
     */
    static invertSqrtPriceX64(sqrtPriceX64: BN): BN;
    /**
     * Calculate the sqrtPriceX64 & tick index slippage price boundary for a given price and slippage.
     * Note: This function loses precision
     *
     * @param sqrtPriceX64 the sqrtPriceX64 to apply the slippage on
     * @param slippage the slippage to apply onto the sqrtPriceX64
     * @returns the sqrtPriceX64 & tick index slippage price boundary
     */
    static getSlippageBoundForSqrtPrice(sqrtPriceX64: BN, slippage: Percentage): {
        lowerBound: [BN, number];
        upperBound: [BN, number];
    };
}

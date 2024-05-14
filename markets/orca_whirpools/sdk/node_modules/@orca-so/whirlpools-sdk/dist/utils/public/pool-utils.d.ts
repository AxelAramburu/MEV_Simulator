import { Address } from "@coral-xyz/anchor";
import { Percentage } from "@orca-so/common-sdk";
import { PublicKey } from "@solana/web3.js";
import BN from "bn.js";
import { WhirlpoolData, WhirlpoolRewardInfoData } from "../../types/public";
import { TokenType } from "./types";
/**
 * @category Whirlpool Utils
 */
export declare class PoolUtil {
    private constructor();
    static isRewardInitialized(rewardInfo: WhirlpoolRewardInfoData): boolean;
    /**
     * Return the corresponding token type (TokenA/B) for this mint key for a Whirlpool.
     *
     * @param pool The Whirlpool to evaluate the mint against
     * @param mint The token mint PublicKey
     * @returns The match result in the form of TokenType enum. undefined if the token mint is not part of the trade pair of the pool.
     */
    static getTokenType(pool: WhirlpoolData, mint: PublicKey): TokenType | undefined;
    static getFeeRate(feeRate: number): Percentage;
    static getProtocolFeeRate(protocolFeeRate: number): Percentage;
    static orderMints(mintX: Address, mintY: Address): [Address, Address];
    static compareMints(mintX: Address, mintY: Address): number;
    /**
     * @category Whirlpool Utils
     * @param liquidity
     * @param currentSqrtPrice
     * @param lowerSqrtPrice
     * @param upperSqrtPrice
     * @param round_up
     * @returns
     */
    static getTokenAmountsFromLiquidity(liquidity: BN, currentSqrtPrice: BN, lowerSqrtPrice: BN, upperSqrtPrice: BN, round_up: boolean): TokenAmounts;
    /**
     * Estimate the liquidity amount required to increase/decrease liquidity.
     *
     * // TODO: At the top end of the price range, tick calcuation is off therefore the results can be off
     *
     * @category Whirlpool Utils
     * @param currTick - Whirlpool's current tick index (aka price)
     * @param lowerTick - Position lower tick index
     * @param upperTick - Position upper tick index
     * @param tokenAmount - The desired amount of tokens to deposit/withdraw
     * @returns An estimated amount of liquidity needed to deposit/withdraw the desired amount of tokens.
     */
    static estimateLiquidityFromTokenAmounts(currTick: number, lowerTick: number, upperTick: number, tokenAmount: TokenAmounts): BN;
    /**
     * Given an arbitrary pair of token mints, this function returns an ordering of the token mints
     * in the format [base, quote]. USD based stable coins are prioritized as the quote currency
     * followed by variants of SOL.
     *
     * @category Whirlpool Utils
     * @param tokenMintAKey - The mint of token A in the token pair.
     * @param tokenMintBKey - The mint of token B in the token pair.
     * @returns A two-element array with the tokens sorted in the order of [baseToken, quoteToken].
     */
    static toBaseQuoteOrder(tokenMintAKey: PublicKey, tokenMintBKey: PublicKey): [PublicKey, PublicKey];
}
/**
 * @category Whirlpool Utils
 */
export type TokenAmounts = {
    tokenA: BN;
    tokenB: BN;
};
/**
 * @category Whirlpool Utils
 */
export declare function toTokenAmount(a: number, b: number): TokenAmounts;

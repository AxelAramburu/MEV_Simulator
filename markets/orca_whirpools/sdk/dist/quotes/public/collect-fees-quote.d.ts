/// <reference types="bn.js" />
import { BN } from "@coral-xyz/anchor";
import { PositionData, TickData, WhirlpoolData } from "../../types/public";
/**
 * @category Quotes
 */
export type CollectFeesQuoteParam = {
    whirlpool: WhirlpoolData;
    position: PositionData;
    tickLower: TickData;
    tickUpper: TickData;
};
/**
 * @category Quotes
 */
export type CollectFeesQuote = {
    feeOwedA: BN;
    feeOwedB: BN;
};
/**
 * Get a quote on the outstanding fees owed to a position.
 *
 * @category Quotes
 * @param param A collection of fetched Whirlpool accounts to faciliate the quote.
 * @returns A quote object containing the fees owed for each token in the pool.
 */
export declare function collectFeesQuote(param: CollectFeesQuoteParam): CollectFeesQuote;

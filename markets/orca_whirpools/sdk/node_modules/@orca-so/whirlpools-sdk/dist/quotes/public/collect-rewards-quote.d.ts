/// <reference types="bn.js" />
import { BN } from "@coral-xyz/anchor";
import { PositionData, TickData, WhirlpoolData } from "../../types/public";
/**
 * Parameters needed to generate a quote on collectible rewards on a position.
 * @category Quotes
 * @param whirlpool - the account data for the whirlpool this position belongs to
 * @param position - the account data for the position
 * @param tickLower - the TickData account for the lower bound of this position
 * @param tickUpper - the TickData account for the upper bound of this position
 * @param timeStampInSeconds - optional parameter to generate this quote to a unix time stamp.
 */
export type CollectRewardsQuoteParam = {
    whirlpool: WhirlpoolData;
    position: PositionData;
    tickLower: TickData;
    tickUpper: TickData;
    timeStampInSeconds?: BN;
};
/**
 * An array of reward amounts that is collectible on a position.
 * @category Quotes
 */
export type CollectRewardsQuote = [BN | undefined, BN | undefined, BN | undefined];
/**
 * Get a quote on the outstanding rewards owed to a position.
 *
 * @category Quotes
 * @param param A collection of fetched Whirlpool accounts to faciliate the quote.
 * @returns A quote object containing the rewards owed for each reward in the pool.
 */
export declare function collectRewardsQuote(param: CollectRewardsQuoteParam): CollectRewardsQuote;

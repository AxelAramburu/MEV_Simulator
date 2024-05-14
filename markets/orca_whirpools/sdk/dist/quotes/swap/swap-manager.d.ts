import BN from "bn.js";
import { WhirlpoolData } from "../../types/public";
import { TickArraySequence } from "./tick-array-sequence";
export type SwapResult = {
    amountA: BN;
    amountB: BN;
    nextTickIndex: number;
    nextSqrtPrice: BN;
    totalFeeAmount: BN;
};
export declare function computeSwap(whirlpoolData: WhirlpoolData, tickSequence: TickArraySequence, tokenAmount: BN, sqrtPriceLimit: BN, amountSpecifiedIsInput: boolean, aToB: boolean): SwapResult;

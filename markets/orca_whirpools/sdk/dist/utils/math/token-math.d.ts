import { Percentage } from "@orca-so/common-sdk";
import BN from "bn.js";
export declare function getAmountDeltaA(currSqrtPrice: BN, targetSqrtPrice: BN, currLiquidity: BN, roundUp: boolean): BN;
export declare function getAmountDeltaB(currSqrtPrice: BN, targetSqrtPrice: BN, currLiquidity: BN, roundUp: boolean): BN;
export declare function getNextSqrtPrice(sqrtPrice: BN, currLiquidity: BN, amount: BN, amountSpecifiedIsInput: boolean, aToB: boolean): BN;
export declare function adjustForSlippage(n: BN, { numerator, denominator }: Percentage, adjustUp: boolean): BN;

import BN from "bn.js";
export type SwapStep = {
    amountIn: BN;
    amountOut: BN;
    nextPrice: BN;
    feeAmount: BN;
};
export declare function computeSwapStep(amountRemaining: BN, feeRate: number, currLiquidity: BN, currSqrtPrice: BN, targetSqrtPrice: BN, amountSpecifiedIsInput: boolean, aToB: boolean): SwapStep;

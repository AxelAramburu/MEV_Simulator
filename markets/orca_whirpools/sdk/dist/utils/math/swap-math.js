"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.computeSwapStep = void 0;
const bn_js_1 = __importDefault(require("bn.js"));
const public_1 = require("../../types/public");
const bit_math_1 = require("./bit-math");
const token_math_1 = require("./token-math");
function computeSwapStep(amountRemaining, feeRate, currLiquidity, currSqrtPrice, targetSqrtPrice, amountSpecifiedIsInput, aToB) {
    let amountFixedDelta = getAmountFixedDelta(currSqrtPrice, targetSqrtPrice, currLiquidity, amountSpecifiedIsInput, aToB);
    let amountCalc = amountRemaining;
    if (amountSpecifiedIsInput) {
        const result = bit_math_1.BitMath.mulDiv(amountRemaining, public_1.FEE_RATE_MUL_VALUE.sub(new bn_js_1.default(feeRate)), public_1.FEE_RATE_MUL_VALUE, 128);
        amountCalc = result;
    }
    let nextSqrtPrice = amountCalc.gte(amountFixedDelta)
        ? targetSqrtPrice
        : (0, token_math_1.getNextSqrtPrice)(currSqrtPrice, currLiquidity, amountCalc, amountSpecifiedIsInput, aToB);
    let isMaxSwap = nextSqrtPrice.eq(targetSqrtPrice);
    let amountUnfixedDelta = getAmountUnfixedDelta(currSqrtPrice, nextSqrtPrice, currLiquidity, amountSpecifiedIsInput, aToB);
    if (!isMaxSwap) {
        amountFixedDelta = getAmountFixedDelta(currSqrtPrice, nextSqrtPrice, currLiquidity, amountSpecifiedIsInput, aToB);
    }
    let amountIn = amountSpecifiedIsInput ? amountFixedDelta : amountUnfixedDelta;
    let amountOut = amountSpecifiedIsInput ? amountUnfixedDelta : amountFixedDelta;
    if (!amountSpecifiedIsInput && amountOut.gt(amountRemaining)) {
        amountOut = amountRemaining;
    }
    let feeAmount;
    if (amountSpecifiedIsInput && !isMaxSwap) {
        feeAmount = amountRemaining.sub(amountIn);
    }
    else {
        const feeRateBN = new bn_js_1.default(feeRate);
        feeAmount = bit_math_1.BitMath.mulDivRoundUp(amountIn, feeRateBN, public_1.FEE_RATE_MUL_VALUE.sub(feeRateBN), 128);
    }
    return {
        amountIn,
        amountOut,
        nextPrice: nextSqrtPrice,
        feeAmount,
    };
}
exports.computeSwapStep = computeSwapStep;
function getAmountFixedDelta(currSqrtPrice, targetSqrtPrice, currLiquidity, amountSpecifiedIsInput, aToB) {
    if (aToB === amountSpecifiedIsInput) {
        return (0, token_math_1.getAmountDeltaA)(currSqrtPrice, targetSqrtPrice, currLiquidity, amountSpecifiedIsInput);
    }
    else {
        return (0, token_math_1.getAmountDeltaB)(currSqrtPrice, targetSqrtPrice, currLiquidity, amountSpecifiedIsInput);
    }
}
function getAmountUnfixedDelta(currSqrtPrice, targetSqrtPrice, currLiquidity, amountSpecifiedIsInput, aToB) {
    if (aToB === amountSpecifiedIsInput) {
        return (0, token_math_1.getAmountDeltaB)(currSqrtPrice, targetSqrtPrice, currLiquidity, !amountSpecifiedIsInput);
    }
    else {
        return (0, token_math_1.getAmountDeltaA)(currSqrtPrice, targetSqrtPrice, currLiquidity, !amountSpecifiedIsInput);
    }
}

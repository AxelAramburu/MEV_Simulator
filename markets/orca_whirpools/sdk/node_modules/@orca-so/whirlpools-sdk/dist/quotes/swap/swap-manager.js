"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.computeSwap = void 0;
const common_sdk_1 = require("@orca-so/common-sdk");
const bn_js_1 = __importDefault(require("bn.js"));
const public_1 = require("../../types/public");
const swap_math_1 = require("../../utils/math/swap-math");
const public_2 = require("../../utils/public");
function computeSwap(whirlpoolData, tickSequence, tokenAmount, sqrtPriceLimit, amountSpecifiedIsInput, aToB) {
    let amountRemaining = tokenAmount;
    let amountCalculated = common_sdk_1.ZERO;
    let currSqrtPrice = whirlpoolData.sqrtPrice;
    let currLiquidity = whirlpoolData.liquidity;
    let currTickIndex = whirlpoolData.tickCurrentIndex;
    let totalFeeAmount = common_sdk_1.ZERO;
    const feeRate = whirlpoolData.feeRate;
    const protocolFeeRate = whirlpoolData.protocolFeeRate;
    let currProtocolFee = new bn_js_1.default(0);
    let currFeeGrowthGlobalInput = aToB
        ? whirlpoolData.feeGrowthGlobalA
        : whirlpoolData.feeGrowthGlobalB;
    while (amountRemaining.gt(common_sdk_1.ZERO) && !sqrtPriceLimit.eq(currSqrtPrice)) {
        let { nextIndex: nextTickIndex } = tickSequence.findNextInitializedTickIndex(currTickIndex);
        let { nextTickPrice, nextSqrtPriceLimit: targetSqrtPrice } = getNextSqrtPrices(nextTickIndex, sqrtPriceLimit, aToB);
        const swapComputation = (0, swap_math_1.computeSwapStep)(amountRemaining, feeRate, currLiquidity, currSqrtPrice, targetSqrtPrice, amountSpecifiedIsInput, aToB);
        totalFeeAmount = totalFeeAmount.add(swapComputation.feeAmount);
        if (amountSpecifiedIsInput) {
            amountRemaining = amountRemaining.sub(swapComputation.amountIn);
            amountRemaining = amountRemaining.sub(swapComputation.feeAmount);
            amountCalculated = amountCalculated.add(swapComputation.amountOut);
        }
        else {
            amountRemaining = amountRemaining.sub(swapComputation.amountOut);
            amountCalculated = amountCalculated.add(swapComputation.amountIn);
            amountCalculated = amountCalculated.add(swapComputation.feeAmount);
        }
        let { nextProtocolFee, nextFeeGrowthGlobalInput } = calculateFees(swapComputation.feeAmount, protocolFeeRate, currLiquidity, currProtocolFee, currFeeGrowthGlobalInput);
        currProtocolFee = nextProtocolFee;
        currFeeGrowthGlobalInput = nextFeeGrowthGlobalInput;
        if (swapComputation.nextPrice.eq(nextTickPrice)) {
            const nextTick = tickSequence.getTick(nextTickIndex);
            if (nextTick.initialized) {
                currLiquidity = calculateNextLiquidity(nextTick.liquidityNet, currLiquidity, aToB);
            }
            currTickIndex = aToB ? nextTickIndex - 1 : nextTickIndex;
        }
        else {
            currTickIndex = public_2.PriceMath.sqrtPriceX64ToTickIndex(swapComputation.nextPrice);
        }
        currSqrtPrice = swapComputation.nextPrice;
    }
    let { amountA, amountB } = calculateEstTokens(tokenAmount, amountRemaining, amountCalculated, aToB, amountSpecifiedIsInput);
    return {
        amountA,
        amountB,
        nextTickIndex: currTickIndex,
        nextSqrtPrice: currSqrtPrice,
        totalFeeAmount,
    };
}
exports.computeSwap = computeSwap;
function getNextSqrtPrices(nextTick, sqrtPriceLimit, aToB) {
    const nextTickPrice = public_2.PriceMath.tickIndexToSqrtPriceX64(nextTick);
    const nextSqrtPriceLimit = aToB
        ? bn_js_1.default.max(sqrtPriceLimit, nextTickPrice)
        : bn_js_1.default.min(sqrtPriceLimit, nextTickPrice);
    return { nextTickPrice, nextSqrtPriceLimit };
}
function calculateFees(feeAmount, protocolFeeRate, currLiquidity, currProtocolFee, currFeeGrowthGlobalInput) {
    let nextProtocolFee = currProtocolFee;
    let nextFeeGrowthGlobalInput = currFeeGrowthGlobalInput;
    let globalFee = feeAmount;
    if (protocolFeeRate > 0) {
        let delta = calculateProtocolFee(globalFee, protocolFeeRate);
        globalFee = globalFee.sub(delta);
        nextProtocolFee = nextProtocolFee.add(currProtocolFee);
    }
    if (currLiquidity.gt(common_sdk_1.ZERO)) {
        const globalFeeIncrement = globalFee.shln(64).div(currLiquidity);
        nextFeeGrowthGlobalInput = nextFeeGrowthGlobalInput.add(globalFeeIncrement);
    }
    return {
        nextProtocolFee,
        nextFeeGrowthGlobalInput,
    };
}
function calculateProtocolFee(globalFee, protocolFeeRate) {
    return globalFee.mul(new bn_js_1.default(protocolFeeRate).div(public_1.PROTOCOL_FEE_RATE_MUL_VALUE));
}
function calculateEstTokens(amount, amountRemaining, amountCalculated, aToB, amountSpecifiedIsInput) {
    return aToB === amountSpecifiedIsInput
        ? {
            amountA: amount.sub(amountRemaining),
            amountB: amountCalculated,
        }
        : {
            amountA: amountCalculated,
            amountB: amount.sub(amountRemaining),
        };
}
function calculateNextLiquidity(tickNetLiquidity, currLiquidity, aToB) {
    return aToB ? currLiquidity.sub(tickNetLiquidity) : currLiquidity.add(tickNetLiquidity);
}

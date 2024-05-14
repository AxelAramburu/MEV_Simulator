"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.collectFeesQuote = void 0;
const common_sdk_1 = require("@orca-so/common-sdk");
/**
 * Get a quote on the outstanding fees owed to a position.
 *
 * @category Quotes
 * @param param A collection of fetched Whirlpool accounts to faciliate the quote.
 * @returns A quote object containing the fees owed for each token in the pool.
 */
function collectFeesQuote(param) {
    const { whirlpool, position, tickLower, tickUpper } = param;
    const { tickCurrentIndex, feeGrowthGlobalA: feeGrowthGlobalAX64, feeGrowthGlobalB: feeGrowthGlobalBX64, } = whirlpool;
    const { tickLowerIndex, tickUpperIndex, liquidity, feeOwedA, feeOwedB, feeGrowthCheckpointA: feeGrowthCheckpointAX64, feeGrowthCheckpointB: feeGrowthCheckpointBX64, } = position;
    const { feeGrowthOutsideA: tickLowerFeeGrowthOutsideAX64, feeGrowthOutsideB: tickLowerFeeGrowthOutsideBX64, } = tickLower;
    const { feeGrowthOutsideA: tickUpperFeeGrowthOutsideAX64, feeGrowthOutsideB: tickUpperFeeGrowthOutsideBX64, } = tickUpper;
    // Calculate the fee growths inside the position
    let feeGrowthBelowAX64 = null;
    let feeGrowthBelowBX64 = null;
    if (tickCurrentIndex < tickLowerIndex) {
        feeGrowthBelowAX64 = common_sdk_1.MathUtil.subUnderflowU128(feeGrowthGlobalAX64, tickLowerFeeGrowthOutsideAX64);
        feeGrowthBelowBX64 = common_sdk_1.MathUtil.subUnderflowU128(feeGrowthGlobalBX64, tickLowerFeeGrowthOutsideBX64);
    }
    else {
        feeGrowthBelowAX64 = tickLowerFeeGrowthOutsideAX64;
        feeGrowthBelowBX64 = tickLowerFeeGrowthOutsideBX64;
    }
    let feeGrowthAboveAX64 = null;
    let feeGrowthAboveBX64 = null;
    if (tickCurrentIndex < tickUpperIndex) {
        feeGrowthAboveAX64 = tickUpperFeeGrowthOutsideAX64;
        feeGrowthAboveBX64 = tickUpperFeeGrowthOutsideBX64;
    }
    else {
        feeGrowthAboveAX64 = common_sdk_1.MathUtil.subUnderflowU128(feeGrowthGlobalAX64, tickUpperFeeGrowthOutsideAX64);
        feeGrowthAboveBX64 = common_sdk_1.MathUtil.subUnderflowU128(feeGrowthGlobalBX64, tickUpperFeeGrowthOutsideBX64);
    }
    const feeGrowthInsideAX64 = common_sdk_1.MathUtil.subUnderflowU128(common_sdk_1.MathUtil.subUnderflowU128(feeGrowthGlobalAX64, feeGrowthBelowAX64), feeGrowthAboveAX64);
    const feeGrowthInsideBX64 = common_sdk_1.MathUtil.subUnderflowU128(common_sdk_1.MathUtil.subUnderflowU128(feeGrowthGlobalBX64, feeGrowthBelowBX64), feeGrowthAboveBX64);
    // Calculate the updated fees owed
    const feeOwedADelta = common_sdk_1.MathUtil.subUnderflowU128(feeGrowthInsideAX64, feeGrowthCheckpointAX64)
        .mul(liquidity)
        .shrn(64);
    const feeOwedBDelta = common_sdk_1.MathUtil.subUnderflowU128(feeGrowthInsideBX64, feeGrowthCheckpointBX64)
        .mul(liquidity)
        .shrn(64);
    const updatedFeeOwedA = feeOwedA.add(feeOwedADelta);
    const updatedFeeOwedB = feeOwedB.add(feeOwedBDelta);
    return {
        feeOwedA: updatedFeeOwedA,
        feeOwedB: updatedFeeOwedB,
    };
}
exports.collectFeesQuote = collectFeesQuote;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTokenBFromLiquidity = exports.getTokenAFromLiquidity = exports.getNextSqrtPrice = exports.getAmountUnfixedDelta = exports.getAmountFixedDelta = exports.getLiquidityFromTokenB = exports.getLiquidityFromTokenA = exports.adjustAmountForSlippage = exports.adjustForSlippage = exports.PositionUtil = exports.PositionStatus = exports.AmountSpecified = exports.SwapDirection = void 0;
const common_sdk_1 = require("@orca-so/common-sdk");
const public_1 = require("./public");
const swap_utils_1 = require("./swap-utils");
var SwapDirection;
(function (SwapDirection) {
    SwapDirection["AtoB"] = "Swap A to B";
    SwapDirection["BtoA"] = "Swap B to A";
})(SwapDirection || (exports.SwapDirection = SwapDirection = {}));
var AmountSpecified;
(function (AmountSpecified) {
    AmountSpecified["Input"] = "Specified input amount";
    AmountSpecified["Output"] = "Specified output amount";
})(AmountSpecified || (exports.AmountSpecified = AmountSpecified = {}));
var PositionStatus;
(function (PositionStatus) {
    PositionStatus[PositionStatus["BelowRange"] = 0] = "BelowRange";
    PositionStatus[PositionStatus["InRange"] = 1] = "InRange";
    PositionStatus[PositionStatus["AboveRange"] = 2] = "AboveRange";
})(PositionStatus || (exports.PositionStatus = PositionStatus = {}));
class PositionUtil {
    constructor() { }
    /**
     * Returns the position status of a given tickCurrentIndex in relation to the tickLowerIndex and tickUpperIndex.
     * If the tickCurrentIndex is below the range, it returns PositionStatus.BelowRange.
     * If the tickCurrentIndex is above the range, it returns PositionStatus.AboveRange.
     * If the tickCurrentIndex is equal to the lower, PositionStatus.InRange is returned.
     * On the other hand, if the tickCurrentIndex is equal to the upper, PositionStatus.AboveRange is returned.
     * The relation "PriceMath.tickIndexToSqrtPriceX64(tickCurrentIndex) <= pool's sqrtPrice" is the reason.
     *
     * @param tickCurrentIndex - Whirlpool's current tick index.
     * @param tickLowerIndex - The tick specifying the lower end of the position range.
     * @param tickUpperIndex - The tick specifying the upper end of the position range.
     * @returns Position status in the form of PositionStatus enum.
     */
    static getPositionStatus(tickCurrentIndex, tickLowerIndex, tickUpperIndex) {
        if (tickCurrentIndex < tickLowerIndex) {
            return PositionStatus.BelowRange;
        }
        else if (tickCurrentIndex < tickUpperIndex) {
            return PositionStatus.InRange;
        }
        else {
            return PositionStatus.AboveRange;
        }
    }
    /**
     * Returns the position status of a given sqrtPriceX64 in relation to the tickLowerIndex and tickUpperIndex.
     * If the sqrtPriceX64 is below the range, it returns PositionStatus.BelowRange.
     * If the sqrtPriceX64 is above the range, it returns PositionStatus.AboveRange.
     * If the sqrtPriceX64 is equal to the lower or upper, PositionStatus.BelowRange or PositionStatus.AboveRange is returned respectively.
     *
     * @param sqrtPriceX64 - X64 representation of the square root of the price.
     * @param tickLowerIndex - The tick specifying the lower end of the position range.
     * @param tickUpperIndex - The tick specifying the upper end of the position range.
     * @returns Position status in the form of PositionStatus enum.
     */
    static getStrictPositionStatus(sqrtPriceX64, tickLowerIndex, tickUpperIndex) {
        const sqrtPriceLowerX64 = public_1.PriceMath.tickIndexToSqrtPriceX64(tickLowerIndex);
        const sqrtPriceUpperX64 = public_1.PriceMath.tickIndexToSqrtPriceX64(tickUpperIndex);
        if (sqrtPriceX64.lte(sqrtPriceLowerX64)) {
            return PositionStatus.BelowRange;
        }
        else if (sqrtPriceX64.gte(sqrtPriceUpperX64)) {
            return PositionStatus.AboveRange;
        }
        else {
            return PositionStatus.InRange;
        }
    }
}
exports.PositionUtil = PositionUtil;
function adjustForSlippage(n, { numerator, denominator }, adjustUp) {
    if (adjustUp) {
        return n.mul(denominator.add(numerator)).div(denominator);
    }
    else {
        return n.mul(denominator).div(denominator.add(numerator));
    }
}
exports.adjustForSlippage = adjustForSlippage;
function adjustAmountForSlippage(amountIn, amountOut, { numerator, denominator }, amountSpecified) {
    if (amountSpecified === AmountSpecified.Input) {
        return amountOut.mul(denominator).div(denominator.add(numerator));
    }
    else {
        return amountIn.mul(denominator.add(numerator)).div(denominator);
    }
}
exports.adjustAmountForSlippage = adjustAmountForSlippage;
function getLiquidityFromTokenA(amount, sqrtPriceLowerX64, sqrtPriceUpperX64, roundUp) {
    const result = amount
        .mul(sqrtPriceLowerX64)
        .mul(sqrtPriceUpperX64)
        .div(sqrtPriceUpperX64.sub(sqrtPriceLowerX64));
    if (roundUp) {
        return common_sdk_1.MathUtil.shiftRightRoundUp(result);
    }
    else {
        return result.shrn(64);
    }
}
exports.getLiquidityFromTokenA = getLiquidityFromTokenA;
function getLiquidityFromTokenB(amount, sqrtPriceLowerX64, sqrtPriceUpperX64, roundUp) {
    const numerator = amount.shln(64);
    const denominator = sqrtPriceUpperX64.sub(sqrtPriceLowerX64);
    if (roundUp) {
        return common_sdk_1.MathUtil.divRoundUp(numerator, denominator);
    }
    else {
        return numerator.div(denominator);
    }
}
exports.getLiquidityFromTokenB = getLiquidityFromTokenB;
function getAmountFixedDelta(currentSqrtPriceX64, targetSqrtPriceX64, liquidity, amountSpecified, swapDirection) {
    if ((amountSpecified == AmountSpecified.Input) == (swapDirection == SwapDirection.AtoB)) {
        return getTokenAFromLiquidity(liquidity, currentSqrtPriceX64, targetSqrtPriceX64, amountSpecified == AmountSpecified.Input);
    }
    else {
        return getTokenBFromLiquidity(liquidity, currentSqrtPriceX64, targetSqrtPriceX64, amountSpecified == AmountSpecified.Input);
    }
}
exports.getAmountFixedDelta = getAmountFixedDelta;
function getAmountUnfixedDelta(currentSqrtPriceX64, targetSqrtPriceX64, liquidity, amountSpecified, swapDirection) {
    if ((amountSpecified == AmountSpecified.Input) == (swapDirection == SwapDirection.AtoB)) {
        return getTokenBFromLiquidity(liquidity, currentSqrtPriceX64, targetSqrtPriceX64, amountSpecified == AmountSpecified.Output);
    }
    else {
        return getTokenAFromLiquidity(liquidity, currentSqrtPriceX64, targetSqrtPriceX64, amountSpecified == AmountSpecified.Output);
    }
}
exports.getAmountUnfixedDelta = getAmountUnfixedDelta;
function getNextSqrtPrice(sqrtPriceX64, liquidity, amount, amountSpecified, swapDirection) {
    if (amountSpecified === AmountSpecified.Input && swapDirection === SwapDirection.AtoB) {
        return (0, swap_utils_1.getLowerSqrtPriceFromTokenA)(amount, liquidity, sqrtPriceX64);
    }
    else if (amountSpecified === AmountSpecified.Output && swapDirection === SwapDirection.BtoA) {
        return (0, swap_utils_1.getUpperSqrtPriceFromTokenA)(amount, liquidity, sqrtPriceX64);
    }
    else if (amountSpecified === AmountSpecified.Input && swapDirection === SwapDirection.BtoA) {
        return (0, swap_utils_1.getUpperSqrtPriceFromTokenB)(amount, liquidity, sqrtPriceX64);
    }
    else {
        return (0, swap_utils_1.getLowerSqrtPriceFromTokenB)(amount, liquidity, sqrtPriceX64);
    }
}
exports.getNextSqrtPrice = getNextSqrtPrice;
function getTokenAFromLiquidity(liquidity, sqrtPrice0X64, sqrtPrice1X64, roundUp) {
    const [sqrtPriceLowerX64, sqrtPriceUpperX64] = orderSqrtPrice(sqrtPrice0X64, sqrtPrice1X64);
    const numerator = liquidity.mul(sqrtPriceUpperX64.sub(sqrtPriceLowerX64)).shln(64);
    const denominator = sqrtPriceUpperX64.mul(sqrtPriceLowerX64);
    if (roundUp) {
        return common_sdk_1.MathUtil.divRoundUp(numerator, denominator);
    }
    else {
        return numerator.div(denominator);
    }
}
exports.getTokenAFromLiquidity = getTokenAFromLiquidity;
function getTokenBFromLiquidity(liquidity, sqrtPrice0X64, sqrtPrice1X64, roundUp) {
    const [sqrtPriceLowerX64, sqrtPriceUpperX64] = orderSqrtPrice(sqrtPrice0X64, sqrtPrice1X64);
    const result = liquidity.mul(sqrtPriceUpperX64.sub(sqrtPriceLowerX64));
    if (roundUp) {
        return common_sdk_1.MathUtil.shiftRightRoundUp(result);
    }
    else {
        return result.shrn(64);
    }
}
exports.getTokenBFromLiquidity = getTokenBFromLiquidity;
/** Private */
function orderSqrtPrice(sqrtPrice0X64, sqrtPrice1X64) {
    if (sqrtPrice0X64.lt(sqrtPrice1X64)) {
        return [sqrtPrice0X64, sqrtPrice1X64];
    }
    else {
        return [sqrtPrice1X64, sqrtPrice0X64];
    }
}

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUpperSqrtPriceFromTokenB = exports.getLowerSqrtPriceFromTokenB = exports.getUpperSqrtPriceFromTokenA = exports.getLowerSqrtPriceFromTokenA = void 0;
const common_sdk_1 = require("@orca-so/common-sdk");
function getLowerSqrtPriceFromTokenA(amount, liquidity, sqrtPriceX64) {
    const numerator = liquidity.mul(sqrtPriceX64).shln(64);
    const denominator = liquidity.shln(64).add(amount.mul(sqrtPriceX64));
    // always round up
    return common_sdk_1.MathUtil.divRoundUp(numerator, denominator);
}
exports.getLowerSqrtPriceFromTokenA = getLowerSqrtPriceFromTokenA;
function getUpperSqrtPriceFromTokenA(amount, liquidity, sqrtPriceX64) {
    const numerator = liquidity.mul(sqrtPriceX64).shln(64);
    const denominator = liquidity.shln(64).sub(amount.mul(sqrtPriceX64));
    // always round up
    return common_sdk_1.MathUtil.divRoundUp(numerator, denominator);
}
exports.getUpperSqrtPriceFromTokenA = getUpperSqrtPriceFromTokenA;
function getLowerSqrtPriceFromTokenB(amount, liquidity, sqrtPriceX64) {
    // always round down
    return sqrtPriceX64.sub(common_sdk_1.MathUtil.divRoundUp(amount.shln(64), liquidity));
}
exports.getLowerSqrtPriceFromTokenB = getLowerSqrtPriceFromTokenB;
function getUpperSqrtPriceFromTokenB(amount, liquidity, sqrtPriceX64) {
    // always round down (rounding up a negative number)
    return sqrtPriceX64.add(amount.shln(64).div(liquidity));
}
exports.getUpperSqrtPriceFromTokenB = getUpperSqrtPriceFromTokenB;

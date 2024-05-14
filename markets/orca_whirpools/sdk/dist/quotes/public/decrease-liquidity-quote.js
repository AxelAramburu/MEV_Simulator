"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.decreaseLiquidityQuoteByLiquidityWithParams = exports.decreaseLiquidityQuoteByLiquidity = void 0;
const common_sdk_1 = require("@orca-so/common-sdk");
const tiny_invariant_1 = __importDefault(require("tiny-invariant"));
const position_util_1 = require("../../utils/position-util");
const public_1 = require("../../utils/public");
/**
 * Get an estimated quote on the minimum tokens receivable based on the desired withdraw liquidity value.
 *
 * @category Quotes
 * @param liquidity - The desired liquidity to withdraw from the Whirlpool
 * @param slippageTolerance - The maximum slippage allowed when calculating the minimum tokens received.
 * @param position - A Position helper class to help interact with the Position account.
 * @param whirlpool - A Whirlpool helper class to help interact with the Whirlpool account.
 * @returns An DecreaseLiquidityQuote object detailing the tokenMin & liquidity values to use when calling decrease-liquidity-ix.
 */
function decreaseLiquidityQuoteByLiquidity(liquidity, slippageTolerance, position, whirlpool) {
    const positionData = position.getData();
    const whirlpoolData = whirlpool.getData();
    (0, tiny_invariant_1.default)(liquidity.lte(positionData.liquidity), "Quote liquidity is more than the position liquidity.");
    return decreaseLiquidityQuoteByLiquidityWithParams({
        liquidity,
        slippageTolerance,
        tickLowerIndex: positionData.tickLowerIndex,
        tickUpperIndex: positionData.tickUpperIndex,
        sqrtPrice: whirlpoolData.sqrtPrice,
        tickCurrentIndex: whirlpoolData.tickCurrentIndex,
    });
}
exports.decreaseLiquidityQuoteByLiquidity = decreaseLiquidityQuoteByLiquidity;
/**
 * Get an estimated quote on the minimum tokens receivable based on the desired withdraw liquidity value.
 *
 * @category Quotes
 * @param param DecreaseLiquidityQuoteParam
 * @returns An DecreaseLiquidityInput object detailing the tokenMin & liquidity values to use when calling decrease-liquidity-ix.
 */
function decreaseLiquidityQuoteByLiquidityWithParams(param) {
    (0, tiny_invariant_1.default)(public_1.TickUtil.checkTickInBounds(param.tickLowerIndex), "tickLowerIndex is out of bounds.");
    (0, tiny_invariant_1.default)(public_1.TickUtil.checkTickInBounds(param.tickUpperIndex), "tickUpperIndex is out of bounds.");
    (0, tiny_invariant_1.default)(public_1.TickUtil.checkTickInBounds(param.tickCurrentIndex), "tickCurrentIndex is out of bounds.");
    const positionStatus = position_util_1.PositionUtil.getStrictPositionStatus(param.sqrtPrice, param.tickLowerIndex, param.tickUpperIndex);
    switch (positionStatus) {
        case position_util_1.PositionStatus.BelowRange:
            return quotePositionBelowRange(param);
        case position_util_1.PositionStatus.InRange:
            return quotePositionInRange(param);
        case position_util_1.PositionStatus.AboveRange:
            return quotePositionAboveRange(param);
        default:
            throw new Error(`type ${positionStatus} is an unknown PositionStatus`);
    }
}
exports.decreaseLiquidityQuoteByLiquidityWithParams = decreaseLiquidityQuoteByLiquidityWithParams;
function quotePositionBelowRange(param) {
    const { tickLowerIndex, tickUpperIndex, liquidity, slippageTolerance } = param;
    const sqrtPriceLowerX64 = public_1.PriceMath.tickIndexToSqrtPriceX64(tickLowerIndex);
    const sqrtPriceUpperX64 = public_1.PriceMath.tickIndexToSqrtPriceX64(tickUpperIndex);
    const tokenEstA = (0, position_util_1.getTokenAFromLiquidity)(liquidity, sqrtPriceLowerX64, sqrtPriceUpperX64, false);
    const tokenMinA = (0, position_util_1.adjustForSlippage)(tokenEstA, slippageTolerance, false);
    return {
        tokenMinA,
        tokenMinB: common_sdk_1.ZERO,
        tokenEstA,
        tokenEstB: common_sdk_1.ZERO,
        liquidityAmount: liquidity,
    };
}
function quotePositionInRange(param) {
    const { sqrtPrice, tickLowerIndex, tickUpperIndex, liquidity, slippageTolerance } = param;
    const sqrtPriceX64 = sqrtPrice;
    const sqrtPriceLowerX64 = public_1.PriceMath.tickIndexToSqrtPriceX64(tickLowerIndex);
    const sqrtPriceUpperX64 = public_1.PriceMath.tickIndexToSqrtPriceX64(tickUpperIndex);
    const tokenEstA = (0, position_util_1.getTokenAFromLiquidity)(liquidity, sqrtPriceX64, sqrtPriceUpperX64, false);
    const tokenMinA = (0, position_util_1.adjustForSlippage)(tokenEstA, slippageTolerance, false);
    const tokenEstB = (0, position_util_1.getTokenBFromLiquidity)(liquidity, sqrtPriceLowerX64, sqrtPriceX64, false);
    const tokenMinB = (0, position_util_1.adjustForSlippage)(tokenEstB, slippageTolerance, false);
    return {
        tokenMinA,
        tokenMinB,
        tokenEstA,
        tokenEstB,
        liquidityAmount: liquidity,
    };
}
function quotePositionAboveRange(param) {
    const { tickLowerIndex, tickUpperIndex, liquidity, slippageTolerance: slippageTolerance } = param;
    const sqrtPriceLowerX64 = public_1.PriceMath.tickIndexToSqrtPriceX64(tickLowerIndex);
    const sqrtPriceUpperX64 = public_1.PriceMath.tickIndexToSqrtPriceX64(tickUpperIndex);
    const tokenEstB = (0, position_util_1.getTokenBFromLiquidity)(liquidity, sqrtPriceLowerX64, sqrtPriceUpperX64, false);
    const tokenMinB = (0, position_util_1.adjustForSlippage)(tokenEstB, slippageTolerance, false);
    return {
        tokenMinA: common_sdk_1.ZERO,
        tokenMinB,
        tokenEstA: common_sdk_1.ZERO,
        tokenEstB,
        liquidityAmount: liquidity,
    };
}

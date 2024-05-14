"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.increaseLiquidityQuoteByInputTokenWithParams = exports.increaseLiquidityQuoteByInputToken = exports.increaseLiquidityQuoteByLiquidityWithParams = exports.increaseLiquidityQuoteByInputTokenWithParamsUsingPriceSlippage = exports.increaseLiquidityQuoteByInputTokenUsingPriceSlippage = void 0;
const common_sdk_1 = require("@orca-so/common-sdk");
const bn_js_1 = __importDefault(require("bn.js"));
const tiny_invariant_1 = __importDefault(require("tiny-invariant"));
const position_util_1 = require("../../utils/position-util");
const public_1 = require("../../utils/public");
/**
 * Get an estimated quote on the maximum tokens required to deposit based on a specified input token amount.
 * This new version calculates slippage based on price percentage movement, rather than setting the percentage threshold based on token estimates.
 *
 * @category Quotes
 * @param inputTokenAmount - The amount of input tokens to deposit.
 * @param inputTokenMint - The mint of the input token the user would like to deposit.
 * @param tickLower - The lower index of the position that we are depositing into.
 * @param tickUpper - The upper index of the position that we are depositing into.
 * @param slippageTolerance - The maximum slippage allowed when calculating the minimum tokens received.
 * @param whirlpool - A Whirlpool helper class to help interact with the Whirlpool account.
 * @returns An IncreaseLiquidityInput object detailing the required token amounts & liquidity values to use when calling increase-liquidity-ix.
 */
function increaseLiquidityQuoteByInputTokenUsingPriceSlippage(inputTokenMint, inputTokenAmount, tickLower, tickUpper, slippageTolerance, whirlpool) {
    const data = whirlpool.getData();
    const tokenAInfo = whirlpool.getTokenAInfo();
    const tokenBInfo = whirlpool.getTokenBInfo();
    const inputMint = common_sdk_1.AddressUtil.toPubKey(inputTokenMint);
    const inputTokenInfo = inputMint.equals(tokenAInfo.mint) ? tokenAInfo : tokenBInfo;
    return increaseLiquidityQuoteByInputTokenWithParamsUsingPriceSlippage({
        inputTokenMint: inputMint,
        inputTokenAmount: common_sdk_1.DecimalUtil.toBN(inputTokenAmount, inputTokenInfo.decimals),
        tickLowerIndex: public_1.TickUtil.getInitializableTickIndex(tickLower, data.tickSpacing),
        tickUpperIndex: public_1.TickUtil.getInitializableTickIndex(tickUpper, data.tickSpacing),
        slippageTolerance,
        ...data,
    });
}
exports.increaseLiquidityQuoteByInputTokenUsingPriceSlippage = increaseLiquidityQuoteByInputTokenUsingPriceSlippage;
/**
 * Get an estimated quote on the maximum tokens required to deposit based on a specified input token amount.
 * This new version calculates slippage based on price percentage movement, rather than setting the percentage threshold based on token estimates.
 *
 * @category Quotes
 * @param param IncreaseLiquidityQuoteParam
 * @returns An IncreaseLiquidityInput object detailing the required token amounts & liquidity values to use when calling increase-liquidity-ix.
 */
function increaseLiquidityQuoteByInputTokenWithParamsUsingPriceSlippage(param) {
    (0, tiny_invariant_1.default)(public_1.TickUtil.checkTickInBounds(param.tickLowerIndex), "tickLowerIndex is out of bounds.");
    (0, tiny_invariant_1.default)(public_1.TickUtil.checkTickInBounds(param.tickUpperIndex), "tickUpperIndex is out of bounds.");
    (0, tiny_invariant_1.default)(param.inputTokenMint.equals(param.tokenMintA) || param.inputTokenMint.equals(param.tokenMintB), `input token mint ${param.inputTokenMint.toBase58()} does not match any tokens in the provided pool.`);
    const liquidity = getLiquidityFromInputToken(param);
    if (liquidity.eq(common_sdk_1.ZERO)) {
        return {
            tokenMaxA: common_sdk_1.ZERO,
            tokenMaxB: common_sdk_1.ZERO,
            liquidityAmount: common_sdk_1.ZERO,
            tokenEstA: common_sdk_1.ZERO,
            tokenEstB: common_sdk_1.ZERO,
        };
    }
    return increaseLiquidityQuoteByLiquidityWithParams({
        liquidity,
        tickCurrentIndex: param.tickCurrentIndex,
        sqrtPrice: param.sqrtPrice,
        tickLowerIndex: param.tickLowerIndex,
        tickUpperIndex: param.tickUpperIndex,
        slippageTolerance: param.slippageTolerance,
    });
}
exports.increaseLiquidityQuoteByInputTokenWithParamsUsingPriceSlippage = increaseLiquidityQuoteByInputTokenWithParamsUsingPriceSlippage;
function getLiquidityFromInputToken(params) {
    const { inputTokenMint, inputTokenAmount, tickLowerIndex, tickUpperIndex, tickCurrentIndex, sqrtPrice } = params;
    (0, tiny_invariant_1.default)(tickLowerIndex < tickUpperIndex, `tickLowerIndex(${tickLowerIndex}) must be less than tickUpperIndex(${tickUpperIndex})`);
    if (inputTokenAmount.eq(common_sdk_1.ZERO)) {
        return common_sdk_1.ZERO;
    }
    const isTokenA = params.tokenMintA.equals(inputTokenMint);
    const sqrtPriceLowerX64 = public_1.PriceMath.tickIndexToSqrtPriceX64(tickLowerIndex);
    const sqrtPriceUpperX64 = public_1.PriceMath.tickIndexToSqrtPriceX64(tickUpperIndex);
    const positionStatus = position_util_1.PositionUtil.getStrictPositionStatus(sqrtPrice, tickLowerIndex, tickUpperIndex);
    if (positionStatus === position_util_1.PositionStatus.BelowRange) {
        return isTokenA ? (0, position_util_1.getLiquidityFromTokenA)(inputTokenAmount, sqrtPriceLowerX64, sqrtPriceUpperX64, false) : common_sdk_1.ZERO;
    }
    if (positionStatus === position_util_1.PositionStatus.AboveRange) {
        return isTokenA ? common_sdk_1.ZERO : (0, position_util_1.getLiquidityFromTokenB)(inputTokenAmount, sqrtPriceLowerX64, sqrtPriceUpperX64, false);
    }
    return isTokenA
        ? (0, position_util_1.getLiquidityFromTokenA)(inputTokenAmount, sqrtPrice, sqrtPriceUpperX64, false)
        : (0, position_util_1.getLiquidityFromTokenB)(inputTokenAmount, sqrtPriceLowerX64, sqrtPrice, false);
}
function increaseLiquidityQuoteByLiquidityWithParams(params) {
    if (params.liquidity.eq(common_sdk_1.ZERO)) {
        return {
            tokenMaxA: common_sdk_1.ZERO,
            tokenMaxB: common_sdk_1.ZERO,
            liquidityAmount: common_sdk_1.ZERO,
            tokenEstA: common_sdk_1.ZERO,
            tokenEstB: common_sdk_1.ZERO,
        };
    }
    const { tokenEstA, tokenEstB } = getTokenEstimatesFromLiquidity(params);
    const { lowerBound: [sLowerSqrtPrice, sLowerIndex], upperBound: [sUpperSqrtPrice, sUpperIndex], } = public_1.PriceMath.getSlippageBoundForSqrtPrice(params.sqrtPrice, params.slippageTolerance);
    const { tokenEstA: tokenEstALower, tokenEstB: tokenEstBLower } = getTokenEstimatesFromLiquidity({
        ...params,
        sqrtPrice: sLowerSqrtPrice,
        tickCurrentIndex: sLowerIndex,
    });
    const { tokenEstA: tokenEstAUpper, tokenEstB: tokenEstBUpper } = getTokenEstimatesFromLiquidity({
        ...params,
        sqrtPrice: sUpperSqrtPrice,
        tickCurrentIndex: sUpperIndex,
    });
    const tokenMaxA = bn_js_1.default.max(bn_js_1.default.max(tokenEstA, tokenEstALower), tokenEstAUpper);
    const tokenMaxB = bn_js_1.default.max(bn_js_1.default.max(tokenEstB, tokenEstBLower), tokenEstBUpper);
    return {
        tokenMaxA,
        tokenMaxB,
        tokenEstA,
        tokenEstB,
        liquidityAmount: params.liquidity,
    };
}
exports.increaseLiquidityQuoteByLiquidityWithParams = increaseLiquidityQuoteByLiquidityWithParams;
function getTokenEstimatesFromLiquidity(params) {
    const { liquidity, sqrtPrice, tickLowerIndex, tickUpperIndex } = params;
    if (liquidity.eq(common_sdk_1.ZERO)) {
        throw new Error("liquidity must be greater than 0");
    }
    let tokenEstA = common_sdk_1.ZERO;
    let tokenEstB = common_sdk_1.ZERO;
    const lowerSqrtPrice = public_1.PriceMath.tickIndexToSqrtPriceX64(tickLowerIndex);
    const upperSqrtPrice = public_1.PriceMath.tickIndexToSqrtPriceX64(tickUpperIndex);
    const positionStatus = position_util_1.PositionUtil.getStrictPositionStatus(sqrtPrice, tickLowerIndex, tickUpperIndex);
    if (positionStatus === position_util_1.PositionStatus.BelowRange) {
        tokenEstA = (0, position_util_1.getTokenAFromLiquidity)(liquidity, lowerSqrtPrice, upperSqrtPrice, true);
    }
    else if (positionStatus === position_util_1.PositionStatus.InRange) {
        tokenEstA = (0, position_util_1.getTokenAFromLiquidity)(liquidity, sqrtPrice, upperSqrtPrice, true);
        tokenEstB = (0, position_util_1.getTokenBFromLiquidity)(liquidity, lowerSqrtPrice, sqrtPrice, true);
    }
    else {
        tokenEstB = (0, position_util_1.getTokenBFromLiquidity)(liquidity, lowerSqrtPrice, upperSqrtPrice, true);
    }
    return { tokenEstA, tokenEstB };
}
/*** --------- Deprecated --------- ***/
/**
 * Get an estimated quote on the maximum tokens required to deposit based on a specified input token amount.
 *
 * @category Quotes
 * @param inputTokenAmount - The amount of input tokens to deposit.
 * @param inputTokenMint - The mint of the input token the user would like to deposit.
 * @param tickLower - The lower index of the position that we are withdrawing from.
 * @param tickUpper - The upper index of the position that we are withdrawing from.
 * @param slippageTolerance - The maximum slippage allowed when calculating the minimum tokens received.
 * @param whirlpool - A Whirlpool helper class to help interact with the Whirlpool account.
 * @returns An IncreaseLiquidityInput object detailing the required token amounts & liquidity values to use when calling increase-liquidity-ix.
 * @deprecated Use increaseLiquidityQuoteByInputTokenUsingPriceSlippage instead.
 */
function increaseLiquidityQuoteByInputToken(inputTokenMint, inputTokenAmount, tickLower, tickUpper, slippageTolerance, whirlpool) {
    const data = whirlpool.getData();
    const tokenAInfo = whirlpool.getTokenAInfo();
    const tokenBInfo = whirlpool.getTokenBInfo();
    const inputMint = common_sdk_1.AddressUtil.toPubKey(inputTokenMint);
    const inputTokenInfo = inputMint.equals(tokenAInfo.mint) ? tokenAInfo : tokenBInfo;
    return increaseLiquidityQuoteByInputTokenWithParams({
        inputTokenMint: inputMint,
        inputTokenAmount: common_sdk_1.DecimalUtil.toBN(inputTokenAmount, inputTokenInfo.decimals),
        tickLowerIndex: public_1.TickUtil.getInitializableTickIndex(tickLower, data.tickSpacing),
        tickUpperIndex: public_1.TickUtil.getInitializableTickIndex(tickUpper, data.tickSpacing),
        slippageTolerance: slippageTolerance,
        ...data,
    });
}
exports.increaseLiquidityQuoteByInputToken = increaseLiquidityQuoteByInputToken;
/**
 * Get an estimated quote on the maximum tokens required to deposit based on a specified input token amount.
 *
 * @category Quotes
 * @param param IncreaseLiquidityQuoteParam
 * @returns An IncreaseLiquidityInput object detailing the required token amounts & liquidity values to use when calling increase-liquidity-ix.
 * @deprecated Use increaseLiquidityQuoteByInputTokenWithParams_PriceSlippage instead.
 */
function increaseLiquidityQuoteByInputTokenWithParams(param) {
    (0, tiny_invariant_1.default)(public_1.TickUtil.checkTickInBounds(param.tickLowerIndex), "tickLowerIndex is out of bounds.");
    (0, tiny_invariant_1.default)(public_1.TickUtil.checkTickInBounds(param.tickUpperIndex), "tickUpperIndex is out of bounds.");
    (0, tiny_invariant_1.default)(param.inputTokenMint.equals(param.tokenMintA) || param.inputTokenMint.equals(param.tokenMintB), `input token mint ${param.inputTokenMint.toBase58()} does not match any tokens in the provided pool.`);
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
exports.increaseLiquidityQuoteByInputTokenWithParams = increaseLiquidityQuoteByInputTokenWithParams;
/**
 * @deprecated
 */
function quotePositionBelowRange(param) {
    const { tokenMintA, inputTokenMint, inputTokenAmount, tickLowerIndex, tickUpperIndex, slippageTolerance, } = param;
    if (!tokenMintA.equals(inputTokenMint)) {
        return {
            tokenMaxA: common_sdk_1.ZERO,
            tokenMaxB: common_sdk_1.ZERO,
            tokenEstA: common_sdk_1.ZERO,
            tokenEstB: common_sdk_1.ZERO,
            liquidityAmount: common_sdk_1.ZERO,
        };
    }
    const sqrtPriceLowerX64 = public_1.PriceMath.tickIndexToSqrtPriceX64(tickLowerIndex);
    const sqrtPriceUpperX64 = public_1.PriceMath.tickIndexToSqrtPriceX64(tickUpperIndex);
    const liquidityAmount = (0, position_util_1.getLiquidityFromTokenA)(inputTokenAmount, sqrtPriceLowerX64, sqrtPriceUpperX64, false);
    const tokenEstA = (0, position_util_1.getTokenAFromLiquidity)(liquidityAmount, sqrtPriceLowerX64, sqrtPriceUpperX64, true);
    const tokenMaxA = (0, position_util_1.adjustForSlippage)(tokenEstA, slippageTolerance, true);
    return {
        tokenMaxA,
        tokenMaxB: common_sdk_1.ZERO,
        tokenEstA,
        tokenEstB: common_sdk_1.ZERO,
        liquidityAmount,
    };
}
/**
 * @deprecated
 */
function quotePositionInRange(param) {
    const { tokenMintA, sqrtPrice, inputTokenMint, inputTokenAmount, tickLowerIndex, tickUpperIndex, slippageTolerance, } = param;
    const sqrtPriceX64 = sqrtPrice;
    const sqrtPriceLowerX64 = public_1.PriceMath.tickIndexToSqrtPriceX64(tickLowerIndex);
    const sqrtPriceUpperX64 = public_1.PriceMath.tickIndexToSqrtPriceX64(tickUpperIndex);
    let [tokenEstA, tokenEstB] = tokenMintA.equals(inputTokenMint)
        ? [inputTokenAmount, undefined]
        : [undefined, inputTokenAmount];
    let liquidityAmount;
    if (tokenEstA) {
        liquidityAmount = (0, position_util_1.getLiquidityFromTokenA)(tokenEstA, sqrtPriceX64, sqrtPriceUpperX64, false);
        tokenEstA = (0, position_util_1.getTokenAFromLiquidity)(liquidityAmount, sqrtPriceX64, sqrtPriceUpperX64, true);
        tokenEstB = (0, position_util_1.getTokenBFromLiquidity)(liquidityAmount, sqrtPriceLowerX64, sqrtPriceX64, true);
    }
    else if (tokenEstB) {
        liquidityAmount = (0, position_util_1.getLiquidityFromTokenB)(tokenEstB, sqrtPriceLowerX64, sqrtPriceX64, false);
        tokenEstA = (0, position_util_1.getTokenAFromLiquidity)(liquidityAmount, sqrtPriceX64, sqrtPriceUpperX64, true);
        tokenEstB = (0, position_util_1.getTokenBFromLiquidity)(liquidityAmount, sqrtPriceLowerX64, sqrtPriceX64, true);
    }
    else {
        throw new Error("invariant violation");
    }
    const tokenMaxA = (0, position_util_1.adjustForSlippage)(tokenEstA, slippageTolerance, true);
    const tokenMaxB = (0, position_util_1.adjustForSlippage)(tokenEstB, slippageTolerance, true);
    return {
        tokenMaxA,
        tokenMaxB,
        tokenEstA: tokenEstA,
        tokenEstB: tokenEstB,
        liquidityAmount,
    };
}
/**
 * @deprecated
 */
function quotePositionAboveRange(param) {
    const { tokenMintB, inputTokenMint, inputTokenAmount, tickLowerIndex, tickUpperIndex, slippageTolerance, } = param;
    if (!tokenMintB.equals(inputTokenMint)) {
        return {
            tokenMaxA: common_sdk_1.ZERO,
            tokenMaxB: common_sdk_1.ZERO,
            tokenEstA: common_sdk_1.ZERO,
            tokenEstB: common_sdk_1.ZERO,
            liquidityAmount: common_sdk_1.ZERO,
        };
    }
    const sqrtPriceLowerX64 = public_1.PriceMath.tickIndexToSqrtPriceX64(tickLowerIndex);
    const sqrtPriceUpperX64 = public_1.PriceMath.tickIndexToSqrtPriceX64(tickUpperIndex);
    const liquidityAmount = (0, position_util_1.getLiquidityFromTokenB)(inputTokenAmount, sqrtPriceLowerX64, sqrtPriceUpperX64, false);
    const tokenEstB = (0, position_util_1.getTokenBFromLiquidity)(liquidityAmount, sqrtPriceLowerX64, sqrtPriceUpperX64, true);
    const tokenMaxB = (0, position_util_1.adjustForSlippage)(tokenEstB, slippageTolerance, true);
    return {
        tokenMaxA: common_sdk_1.ZERO,
        tokenMaxB,
        tokenEstA: common_sdk_1.ZERO,
        tokenEstB,
        liquidityAmount,
    };
}

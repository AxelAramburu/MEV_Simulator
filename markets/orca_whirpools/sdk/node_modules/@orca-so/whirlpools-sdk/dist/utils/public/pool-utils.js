"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.toTokenAmount = exports.PoolUtil = void 0;
const common_sdk_1 = require("@orca-so/common-sdk");
const web3_js_1 = require("@solana/web3.js");
const bn_js_1 = __importDefault(require("bn.js"));
const decimal_js_1 = __importDefault(require("decimal.js"));
const constants_1 = require("../constants");
const price_math_1 = require("./price-math");
const types_1 = require("./types");
/**
 * @category Whirlpool Utils
 */
class PoolUtil {
    constructor() { }
    static isRewardInitialized(rewardInfo) {
        return (!web3_js_1.PublicKey.default.equals(rewardInfo.mint) && !web3_js_1.PublicKey.default.equals(rewardInfo.vault));
    }
    /**
     * Return the corresponding token type (TokenA/B) for this mint key for a Whirlpool.
     *
     * @param pool The Whirlpool to evaluate the mint against
     * @param mint The token mint PublicKey
     * @returns The match result in the form of TokenType enum. undefined if the token mint is not part of the trade pair of the pool.
     */
    static getTokenType(pool, mint) {
        if (pool.tokenMintA.equals(mint)) {
            return types_1.TokenType.TokenA;
        }
        else if (pool.tokenMintB.equals(mint)) {
            return types_1.TokenType.TokenB;
        }
        return undefined;
    }
    static getFeeRate(feeRate) {
        /**
         * Smart Contract comment: https://github.com/orca-so/whirlpool/blob/main/programs/whirlpool/src/state/whirlpool.rs#L9-L11
         * // Stored as hundredths of a basis point
         * // u16::MAX corresponds to ~6.5%
         * pub fee_rate: u16,
         */
        return common_sdk_1.Percentage.fromFraction(feeRate, 1e6); // TODO
    }
    static getProtocolFeeRate(protocolFeeRate) {
        /**
         * Smart Contract comment: https://github.com/orca-so/whirlpool/blob/main/programs/whirlpool/src/state/whirlpool.rs#L13-L14
         * // Stored as a basis point
         * pub protocol_fee_rate: u16,
         */
        return common_sdk_1.Percentage.fromFraction(protocolFeeRate, 1e4); // TODO
    }
    static orderMints(mintX, mintY) {
        return this.compareMints(mintX, mintY) < 0 ? [mintX, mintY] : [mintY, mintX];
    }
    static compareMints(mintX, mintY) {
        return Buffer.compare(common_sdk_1.AddressUtil.toPubKey(mintX).toBuffer(), common_sdk_1.AddressUtil.toPubKey(mintY).toBuffer());
    }
    /**
     * @category Whirlpool Utils
     * @param liquidity
     * @param currentSqrtPrice
     * @param lowerSqrtPrice
     * @param upperSqrtPrice
     * @param round_up
     * @returns
     */
    static getTokenAmountsFromLiquidity(liquidity, currentSqrtPrice, lowerSqrtPrice, upperSqrtPrice, round_up) {
        const _liquidity = new decimal_js_1.default(liquidity.toString());
        const _currentPrice = new decimal_js_1.default(currentSqrtPrice.toString());
        const _lowerPrice = new decimal_js_1.default(lowerSqrtPrice.toString());
        const _upperPrice = new decimal_js_1.default(upperSqrtPrice.toString());
        let tokenA, tokenB;
        if (currentSqrtPrice.lt(lowerSqrtPrice)) {
            // x = L * (pb - pa) / (pa * pb)
            tokenA = common_sdk_1.MathUtil.toX64_Decimal(_liquidity)
                .mul(_upperPrice.sub(_lowerPrice))
                .div(_lowerPrice.mul(_upperPrice));
            tokenB = new decimal_js_1.default(0);
        }
        else if (currentSqrtPrice.lt(upperSqrtPrice)) {
            // x = L * (pb - p) / (p * pb)
            // y = L * (p - pa)
            tokenA = common_sdk_1.MathUtil.toX64_Decimal(_liquidity)
                .mul(_upperPrice.sub(_currentPrice))
                .div(_currentPrice.mul(_upperPrice));
            tokenB = common_sdk_1.MathUtil.fromX64_Decimal(_liquidity.mul(_currentPrice.sub(_lowerPrice)));
        }
        else {
            // y = L * (pb - pa)
            tokenA = new decimal_js_1.default(0);
            tokenB = common_sdk_1.MathUtil.fromX64_Decimal(_liquidity.mul(_upperPrice.sub(_lowerPrice)));
        }
        // TODO: round up
        if (round_up) {
            return {
                tokenA: new bn_js_1.default(tokenA.ceil().toString()),
                tokenB: new bn_js_1.default(tokenB.ceil().toString()),
            };
        }
        else {
            return {
                tokenA: new bn_js_1.default(tokenA.floor().toString()),
                tokenB: new bn_js_1.default(tokenB.floor().toString()),
            };
        }
    }
    /**
     * Estimate the liquidity amount required to increase/decrease liquidity.
     *
     * // TODO: At the top end of the price range, tick calcuation is off therefore the results can be off
     *
     * @category Whirlpool Utils
     * @param currTick - Whirlpool's current tick index (aka price)
     * @param lowerTick - Position lower tick index
     * @param upperTick - Position upper tick index
     * @param tokenAmount - The desired amount of tokens to deposit/withdraw
     * @returns An estimated amount of liquidity needed to deposit/withdraw the desired amount of tokens.
     */
    static estimateLiquidityFromTokenAmounts(currTick, lowerTick, upperTick, tokenAmount) {
        if (upperTick < lowerTick) {
            throw new Error("upper tick cannot be lower than the lower tick");
        }
        const currSqrtPrice = price_math_1.PriceMath.tickIndexToSqrtPriceX64(currTick);
        const lowerSqrtPrice = price_math_1.PriceMath.tickIndexToSqrtPriceX64(lowerTick);
        const upperSqrtPrice = price_math_1.PriceMath.tickIndexToSqrtPriceX64(upperTick);
        if (currTick >= upperTick) {
            return estLiquidityForTokenB(upperSqrtPrice, lowerSqrtPrice, tokenAmount.tokenB);
        }
        else if (currTick < lowerTick) {
            return estLiquidityForTokenA(lowerSqrtPrice, upperSqrtPrice, tokenAmount.tokenA);
        }
        else {
            const estLiquidityAmountA = estLiquidityForTokenA(currSqrtPrice, upperSqrtPrice, tokenAmount.tokenA);
            const estLiquidityAmountB = estLiquidityForTokenB(currSqrtPrice, lowerSqrtPrice, tokenAmount.tokenB);
            return bn_js_1.default.min(estLiquidityAmountA, estLiquidityAmountB);
        }
    }
    /**
     * Given an arbitrary pair of token mints, this function returns an ordering of the token mints
     * in the format [base, quote]. USD based stable coins are prioritized as the quote currency
     * followed by variants of SOL.
     *
     * @category Whirlpool Utils
     * @param tokenMintAKey - The mint of token A in the token pair.
     * @param tokenMintBKey - The mint of token B in the token pair.
     * @returns A two-element array with the tokens sorted in the order of [baseToken, quoteToken].
     */
    static toBaseQuoteOrder(tokenMintAKey, tokenMintBKey) {
        const pair = [tokenMintAKey, tokenMintBKey];
        return pair.sort(sortByQuotePriority);
    }
}
exports.PoolUtil = PoolUtil;
/**
 * @category Whirlpool Utils
 */
function toTokenAmount(a, b) {
    return {
        tokenA: new bn_js_1.default(a.toString()),
        tokenB: new bn_js_1.default(b.toString()),
    };
}
exports.toTokenAmount = toTokenAmount;
// These are the token mints that will be prioritized as the second token in the pair (quote).
// The number that the mint maps to determines the priority that it will be used as the quote
// currency.
const QUOTE_TOKENS = {
    [constants_1.TOKEN_MINTS["USDT"]]: 100,
    [constants_1.TOKEN_MINTS["USDC"]]: 90, // USDC
    [constants_1.TOKEN_MINTS["USDH"]]: 80, // USDH
    [constants_1.TOKEN_MINTS["SOL"]]: 70, // SOL
    [constants_1.TOKEN_MINTS["mSOL"]]: 60, // mSOL
    [constants_1.TOKEN_MINTS["stSOL"]]: 50, // stSOL
};
const DEFAULT_QUOTE_PRIORITY = 0;
function getQuoteTokenPriority(mint) {
    const value = QUOTE_TOKENS[mint];
    if (value) {
        return value;
    }
    return DEFAULT_QUOTE_PRIORITY;
}
function sortByQuotePriority(mintLeft, mintRight) {
    return getQuoteTokenPriority(mintLeft.toString()) - getQuoteTokenPriority(mintRight.toString());
}
// Convert this function based on Delta A = Delta L * (1/sqrt(lower) - 1/sqrt(upper))
function estLiquidityForTokenA(sqrtPrice1, sqrtPrice2, tokenAmount) {
    const lowerSqrtPriceX64 = bn_js_1.default.min(sqrtPrice1, sqrtPrice2);
    const upperSqrtPriceX64 = bn_js_1.default.max(sqrtPrice1, sqrtPrice2);
    const num = common_sdk_1.MathUtil.fromX64_BN(tokenAmount.mul(upperSqrtPriceX64).mul(lowerSqrtPriceX64));
    const dem = upperSqrtPriceX64.sub(lowerSqrtPriceX64);
    return num.div(dem);
}
// Convert this function based on Delta B = Delta L * (sqrt_price(upper) - sqrt_price(lower))
function estLiquidityForTokenB(sqrtPrice1, sqrtPrice2, tokenAmount) {
    const lowerSqrtPriceX64 = bn_js_1.default.min(sqrtPrice1, sqrtPrice2);
    const upperSqrtPriceX64 = bn_js_1.default.max(sqrtPrice1, sqrtPrice2);
    const delta = upperSqrtPriceX64.sub(lowerSqrtPriceX64);
    return tokenAmount.shln(64).div(delta);
}

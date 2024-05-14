"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.convertAmount = exports.isSubset = exports.calculatePricesForQuoteToken = void 0;
const common_sdk_1 = require("@orca-so/common-sdk");
const decimal_js_1 = __importDefault(require("decimal.js"));
const _1 = require(".");
const swap_quote_1 = require("../quotes/public/swap-quote");
const public_1 = require("../utils/public");
function checkLiquidity(pool, tickArrays, aToB, thresholdConfig, decimalsMap) {
    const { amountOut, priceImpactThreshold } = thresholdConfig;
    let estimatedAmountIn;
    try {
        ({ estimatedAmountIn } = (0, swap_quote_1.swapQuoteWithParams)({
            whirlpoolData: pool,
            aToB,
            amountSpecifiedIsInput: false,
            tokenAmount: amountOut,
            otherAmountThreshold: public_1.SwapUtils.getDefaultOtherAmountThreshold(false),
            sqrtPriceLimit: public_1.SwapUtils.getDefaultSqrtPriceLimit(aToB),
            tickArrays,
        }, common_sdk_1.Percentage.fromDecimal(new decimal_js_1.default(0))));
    }
    catch (e) {
        // If a quote could not be generated, assume there is insufficient liquidity
        return false;
    }
    // Calculate the maximum amount in that is allowed against the desired output
    let price, inputDecimals, outputDecimals;
    if (aToB) {
        price = getPrice(pool, decimalsMap);
        inputDecimals = decimalsMap[pool.tokenMintA.toBase58()];
        outputDecimals = decimalsMap[pool.tokenMintB.toBase58()];
    }
    else {
        price = getPrice(pool, decimalsMap).pow(-1);
        inputDecimals = decimalsMap[pool.tokenMintB.toBase58()];
        outputDecimals = decimalsMap[pool.tokenMintA.toBase58()];
    }
    const amountOutDecimals = common_sdk_1.DecimalUtil.fromBN(amountOut, outputDecimals);
    const estimatedAmountInDecimals = common_sdk_1.DecimalUtil.fromBN(estimatedAmountIn, inputDecimals);
    const maxAmountInDecimals = amountOutDecimals
        .div(price)
        .mul(priceImpactThreshold)
        .toDecimalPlaces(inputDecimals);
    return estimatedAmountInDecimals.lte(maxAmountInDecimals);
}
function getMostLiquidPools(quoteTokenMint, poolMap) {
    const mostLiquidPools = new Map();
    Object.entries(poolMap).forEach(([address, pool]) => {
        const mintA = pool.tokenMintA.toBase58();
        const mintB = pool.tokenMintB.toBase58();
        if (pool.liquidity.isZero()) {
            return;
        }
        if (!pool.tokenMintA.equals(quoteTokenMint) && !pool.tokenMintB.equals(quoteTokenMint)) {
            return;
        }
        const baseTokenMint = pool.tokenMintA.equals(quoteTokenMint) ? mintB : mintA;
        const existingPool = mostLiquidPools.get(baseTokenMint);
        if (!existingPool || pool.liquidity.gt(existingPool.pool.liquidity)) {
            mostLiquidPools.set(baseTokenMint, { address: common_sdk_1.AddressUtil.toPubKey(address), pool });
        }
    });
    return Object.fromEntries(mostLiquidPools);
}
function calculatePricesForQuoteToken(mints, quoteTokenMint, poolMap, tickArrayMap, decimalsMap, config, thresholdConfig) {
    const mostLiquidPools = getMostLiquidPools(quoteTokenMint, poolMap);
    return Object.fromEntries(mints.map((mintAddr) => {
        const mint = common_sdk_1.AddressUtil.toPubKey(mintAddr);
        if (mint.equals(quoteTokenMint)) {
            return [mint.toBase58(), new decimal_js_1.default(1)];
        }
        const [mintA, mintB] = public_1.PoolUtil.orderMints(mint, quoteTokenMint);
        // The quote token is the output token.
        // Therefore, if the quote token is mintB, then we are swapping from mintA to mintB.
        const aToB = common_sdk_1.AddressUtil.toPubKey(mintB).equals(quoteTokenMint);
        const baseTokenMint = aToB ? mintA : mintB;
        const poolCandidate = mostLiquidPools[common_sdk_1.AddressUtil.toString(baseTokenMint)];
        if (poolCandidate === undefined) {
            return [mint.toBase58(), null];
        }
        const { pool, address } = poolCandidate;
        const tickArrays = getTickArrays(pool, address, aToB, tickArrayMap, config);
        const isPoolLiquid = checkLiquidity(pool, tickArrays, aToB, thresholdConfig, decimalsMap);
        if (!isPoolLiquid) {
            return [mint.toBase58(), null];
        }
        const price = getPrice(pool, decimalsMap);
        const quotePrice = aToB ? price : price.pow(-1);
        return [mint.toBase58(), quotePrice];
    }));
}
exports.calculatePricesForQuoteToken = calculatePricesForQuoteToken;
function getTickArrays(pool, address, aToB, tickArrayMap, config = _1.defaultGetPricesConfig) {
    const { programId } = config;
    const tickArrayPublicKeys = public_1.SwapUtils.getTickArrayPublicKeys(pool.tickCurrentIndex, pool.tickSpacing, aToB, programId, address);
    return tickArrayPublicKeys.map((tickArrayPublicKey) => {
        return { address: tickArrayPublicKey, data: tickArrayMap[tickArrayPublicKey.toBase58()] };
    });
}
function getPrice(pool, decimalsMap) {
    const tokenAAddress = pool.tokenMintA.toBase58();
    const tokenBAddress = pool.tokenMintB.toBase58();
    if (!(tokenAAddress in decimalsMap) || !(tokenBAddress in decimalsMap)) {
        throw new Error("Missing token decimals");
    }
    return public_1.PriceMath.sqrtPriceX64ToPrice(pool.sqrtPrice, decimalsMap[tokenAAddress], decimalsMap[tokenBAddress]);
}
function isSubset(listA, listB) {
    return listA.every((itemA) => listB.includes(itemA));
}
exports.isSubset = isSubset;
function convertAmount(amount, price, amountDecimal, resultDecimal) {
    return common_sdk_1.DecimalUtil.toBN(common_sdk_1.DecimalUtil.fromBN(amount, amountDecimal).div(price), resultDecimal);
}
exports.convertAmount = convertAmount;

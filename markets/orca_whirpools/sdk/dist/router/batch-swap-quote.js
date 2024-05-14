"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.batchBuildSwapQuoteParams = void 0;
const common_sdk_1 = require("@orca-so/common-sdk");
const tiny_invariant_1 = __importDefault(require("tiny-invariant"));
const public_1 = require("../utils/public");
async function batchBuildSwapQuoteParams(quoteRequests, programId, fetcher, opts) {
    const whirlpools = await fetcher.getPools(quoteRequests.map((req) => req.whirlpool), opts);
    const program = common_sdk_1.AddressUtil.toPubKey(programId);
    const tickArrayRequests = quoteRequests.map((quoteReq) => {
        const { whirlpool, tokenAmount, tradeTokenMint, amountSpecifiedIsInput } = quoteReq;
        const whirlpoolData = whirlpools.get(common_sdk_1.AddressUtil.toString(whirlpool));
        const swapMintKey = common_sdk_1.AddressUtil.toPubKey(tradeTokenMint);
        const swapTokenType = public_1.PoolUtil.getTokenType(whirlpoolData, swapMintKey);
        (0, tiny_invariant_1.default)(!!swapTokenType, "swapTokenMint does not match any tokens on this pool");
        const aToB = public_1.SwapUtils.getSwapDirection(whirlpoolData, swapMintKey, amountSpecifiedIsInput) ===
            public_1.SwapDirection.AtoB;
        return {
            whirlpoolData,
            tokenAmount,
            aToB,
            tickCurrentIndex: whirlpoolData.tickCurrentIndex,
            tickSpacing: whirlpoolData.tickSpacing,
            whirlpoolAddress: common_sdk_1.AddressUtil.toPubKey(whirlpool),
            amountSpecifiedIsInput,
        };
    });
    const tickArrays = await public_1.SwapUtils.getBatchTickArrays(program, fetcher, tickArrayRequests, opts);
    return tickArrayRequests.map((req, index) => {
        const { whirlpoolData, tokenAmount, aToB, amountSpecifiedIsInput } = req;
        return {
            whirlpoolData,
            tokenAmount,
            aToB,
            amountSpecifiedIsInput,
            sqrtPriceLimit: public_1.SwapUtils.getDefaultSqrtPriceLimit(aToB),
            otherAmountThreshold: public_1.SwapUtils.getDefaultOtherAmountThreshold(amountSpecifiedIsInput),
            tickArrays: tickArrays[index],
        };
    });
}
exports.batchBuildSwapQuoteParams = batchBuildSwapQuoteParams;

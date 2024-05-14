"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.twoHopSwapQuoteFromSwapQuotes = void 0;
/**
 * Convert two individual swaps into a quote estimate
 * @category Quotes
 * @experimental Not yet ready for use
 */
function twoHopSwapQuoteFromSwapQuotes(swapQuoteOne, swapQuoteTwo) {
    const amountSpecifiedIsInput = swapQuoteOne.amountSpecifiedIsInput;
    // If amount specified is input, then we care about input of the first swap
    // otherwise we care about output of the second swap
    let [amount, otherAmountThreshold] = amountSpecifiedIsInput
        ? [swapQuoteOne.amount, swapQuoteTwo.otherAmountThreshold]
        : [swapQuoteTwo.amount, swapQuoteOne.otherAmountThreshold];
    return {
        amount,
        otherAmountThreshold,
        amountSpecifiedIsInput,
        aToBOne: swapQuoteOne.aToB,
        aToBTwo: swapQuoteTwo.aToB,
        sqrtPriceLimitOne: swapQuoteOne.sqrtPriceLimit,
        sqrtPriceLimitTwo: swapQuoteTwo.sqrtPriceLimit,
        tickArrayOne0: swapQuoteOne.tickArray0,
        tickArrayOne1: swapQuoteOne.tickArray1,
        tickArrayOne2: swapQuoteOne.tickArray2,
        tickArrayTwo0: swapQuoteTwo.tickArray0,
        tickArrayTwo1: swapQuoteTwo.tickArray1,
        tickArrayTwo2: swapQuoteTwo.tickArray2,
        swapOneEstimates: { ...swapQuoteOne },
        swapTwoEstimates: { ...swapQuoteTwo },
    };
}
exports.twoHopSwapQuoteFromSwapQuotes = twoHopSwapQuoteFromSwapQuotes;

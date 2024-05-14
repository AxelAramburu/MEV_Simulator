import { TwoHopSwapInput } from "../../instructions";
import { SwapEstimates, SwapQuote } from "../public/swap-quote";
/**
 * A collection of estimated values from quoting a swap.
 * @category Quotes
 * @link {NormalTwoHopSwapQuote}
 * @experimental Not yet ready for use
 */
export type TwoHopSwapQuote = NormalTwoHopSwapQuote;
/**
 * A collection of estimated values from quoting a two-hop-swap.
 * @category Quotes
 * @param swapOneEstimates - Estimates for the first leg of the two-hop-swap
 * @param swapTwoEstimates - Estimates for the second leg of the two-hop-swap
 * @experimental Not yet ready for use
 */
export type NormalTwoHopSwapQuote = {
    swapOneEstimates: SwapEstimates;
    swapTwoEstimates: SwapEstimates;
} & TwoHopSwapInput;
/**
 * Convert two individual swaps into a quote estimate
 * @category Quotes
 * @experimental Not yet ready for use
 */
export declare function twoHopSwapQuoteFromSwapQuotes(swapQuoteOne: SwapQuote, swapQuoteTwo: SwapQuote): TwoHopSwapQuote;

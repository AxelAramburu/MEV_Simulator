import { SwapQuote, SwapQuoteParam } from "../public";
/**
 * Figure out the quote parameters needed to successfully complete this trade on chain
 * @param param
 * @returns
 * @exceptions
 */
export declare function simulateSwap(params: SwapQuoteParam): SwapQuote;

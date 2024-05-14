import { RoutingOptions, TradeRoute } from "./public";
import { SanitizedQuoteMap } from "./quote-map";
export declare function getBestRoutesFromQuoteMap(quoteMap: SanitizedQuoteMap, amountSpecifiedIsInput: boolean, opts: RoutingOptions): TradeRoute[];

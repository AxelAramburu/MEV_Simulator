import { Address } from "@coral-xyz/anchor";
import BN from "bn.js";
import { WhirlpoolAccountFetcherInterface, WhirlpoolAccountFetchOptions } from "../network/public/fetcher";
import { SwapQuoteParam } from "../quotes/public";
export interface SwapQuoteRequest {
    whirlpool: Address;
    tradeTokenMint: Address;
    tokenAmount: BN;
    amountSpecifiedIsInput: boolean;
}
export declare function batchBuildSwapQuoteParams(quoteRequests: SwapQuoteRequest[], programId: Address, fetcher: WhirlpoolAccountFetcherInterface, opts?: WhirlpoolAccountFetchOptions): Promise<SwapQuoteParam[]>;

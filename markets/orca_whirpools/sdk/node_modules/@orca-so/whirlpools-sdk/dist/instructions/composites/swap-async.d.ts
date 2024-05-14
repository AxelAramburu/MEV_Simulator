import { TransactionBuilder } from "@orca-so/common-sdk";
import { PublicKey } from "@solana/web3.js";
import { Whirlpool, WhirlpoolContext } from "../..";
import { WhirlpoolAccountFetchOptions } from "../../network/public/fetcher";
import { SwapInput } from "../swap-ix";
export type SwapAsyncParams = {
    swapInput: SwapInput;
    whirlpool: Whirlpool;
    wallet: PublicKey;
};
/**
 * Swap instruction builder method with resolveATA & additional checks.
 * @param ctx - WhirlpoolContext object for the current environment.
 * @param params - {@link SwapAsyncParams}
 * @param opts - {@link WhirlpoolAccountFetchOptions} to use for account fetching.
 * @returns
 */
export declare function swapAsync(ctx: WhirlpoolContext, params: SwapAsyncParams, opts: WhirlpoolAccountFetchOptions): Promise<TransactionBuilder>;

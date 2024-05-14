"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.swapAsync = void 0;
const common_sdk_1 = require("@orca-so/common-sdk");
const __1 = require("../..");
const swap_ix_1 = require("../swap-ix");
/**
 * Swap instruction builder method with resolveATA & additional checks.
 * @param ctx - WhirlpoolContext object for the current environment.
 * @param params - {@link SwapAsyncParams}
 * @param opts - {@link WhirlpoolAccountFetchOptions} to use for account fetching.
 * @returns
 */
async function swapAsync(ctx, params, opts) {
    const { wallet, whirlpool, swapInput } = params;
    const { aToB, amount } = swapInput;
    const txBuilder = new common_sdk_1.TransactionBuilder(ctx.connection, ctx.wallet, ctx.txBuilderOpts);
    const tickArrayAddresses = [swapInput.tickArray0, swapInput.tickArray1, swapInput.tickArray2];
    let uninitializedArrays = await __1.TickArrayUtil.getUninitializedArraysString(tickArrayAddresses, ctx.fetcher, opts);
    if (uninitializedArrays) {
        throw new Error(`TickArray addresses - [${uninitializedArrays}] need to be initialized.`);
    }
    const data = whirlpool.getData();
    const [resolvedAtaA, resolvedAtaB] = await (0, common_sdk_1.resolveOrCreateATAs)(ctx.connection, wallet, [
        { tokenMint: data.tokenMintA, wrappedSolAmountIn: aToB ? amount : common_sdk_1.ZERO },
        { tokenMint: data.tokenMintB, wrappedSolAmountIn: !aToB ? amount : common_sdk_1.ZERO },
    ], () => ctx.fetcher.getAccountRentExempt(), undefined, // use default
    true, // use idempotent to allow multiple simultaneous calls
    ctx.accountResolverOpts.allowPDAOwnerAddress, ctx.accountResolverOpts.createWrappedSolAccountMethod);
    const { address: ataAKey, ...tokenOwnerAccountAIx } = resolvedAtaA;
    const { address: ataBKey, ...tokenOwnerAccountBIx } = resolvedAtaB;
    txBuilder.addInstructions([tokenOwnerAccountAIx, tokenOwnerAccountBIx]);
    const inputTokenAccount = aToB ? ataAKey : ataBKey;
    const outputTokenAccount = aToB ? ataBKey : ataAKey;
    return txBuilder.addInstruction((0, swap_ix_1.swapIx)(ctx.program, __1.SwapUtils.getSwapParamsFromQuote(swapInput, ctx, whirlpool, inputTokenAccount, outputTokenAccount, wallet)));
}
exports.swapAsync = swapAsync;

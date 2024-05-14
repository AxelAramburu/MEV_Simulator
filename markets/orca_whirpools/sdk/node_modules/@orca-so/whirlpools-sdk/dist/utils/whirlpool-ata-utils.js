"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addNativeMintHandlingIx = exports.resolveAtaForMints = exports.getTokenMintsFromWhirlpools = exports.TokenMintTypes = void 0;
const common_sdk_1 = require("@orca-so/common-sdk");
const spl_token_1 = require("@solana/spl-token");
const web3_js_1 = require("@solana/web3.js");
const __1 = require("..");
const txn_utils_1 = require("./txn-utils");
var TokenMintTypes;
(function (TokenMintTypes) {
    TokenMintTypes["ALL"] = "ALL";
    TokenMintTypes["POOL_ONLY"] = "POOL_ONLY";
    TokenMintTypes["REWARD_ONLY"] = "REWARDS_ONLY";
})(TokenMintTypes || (exports.TokenMintTypes = TokenMintTypes = {}));
/**
 * Fetch a list of affliated tokens from a list of whirlpools
 *
 * SOL tokens does not use the ATA program and therefore not handled.
 * @param whirlpoolDatas An array of whirlpoolData (from fetcher.listPools)
 * @param mintTypes The set of mints to collect from these whirlpools
 * @returns All the whirlpool, reward token mints in the given set of whirlpools
 */
function getTokenMintsFromWhirlpools(whirlpoolDatas, mintTypes = TokenMintTypes.ALL) {
    let hasNativeMint = false;
    const mints = Array.from(whirlpoolDatas.reduce((accu, whirlpoolData) => {
        if (whirlpoolData) {
            if (mintTypes === TokenMintTypes.ALL || mintTypes === TokenMintTypes.POOL_ONLY) {
                const { tokenMintA, tokenMintB } = whirlpoolData;
                // TODO: Once we move to sync-native for wSOL wrapping, we can simplify and use wSOL ATA instead of a custom token account.
                if (!common_sdk_1.TokenUtil.isNativeMint(tokenMintA)) {
                    accu.add(tokenMintA.toBase58());
                }
                else {
                    hasNativeMint = true;
                }
                if (!common_sdk_1.TokenUtil.isNativeMint(tokenMintB)) {
                    accu.add(tokenMintB.toBase58());
                }
                else {
                    hasNativeMint = true;
                }
            }
            if (mintTypes === TokenMintTypes.ALL || mintTypes === TokenMintTypes.REWARD_ONLY) {
                const rewardInfos = whirlpoolData.rewardInfos;
                rewardInfos.forEach((reward) => {
                    if (common_sdk_1.TokenUtil.isNativeMint(reward.mint)) {
                        hasNativeMint = true;
                    }
                    if (__1.PoolUtil.isRewardInitialized(reward)) {
                        accu.add(reward.mint.toBase58());
                    }
                });
            }
        }
        return accu;
    }, new Set())).map((mint) => new web3_js_1.PublicKey(mint));
    return {
        mintMap: mints,
        hasNativeMint,
    };
}
exports.getTokenMintsFromWhirlpools = getTokenMintsFromWhirlpools;
/**
 * Build instructions to resolve ATAs (Associated Tokens Addresses) for affliated tokens in a list of Whirlpools.
 * Affliated tokens are tokens that are part of the trade pair or reward in a Whirlpool.
 *
 * @param ctx - WhirlpoolContext object for the current environment.
 * @param params - ResolveAtaInstructionParams
 * @returns a ResolvedTokenAddressesIxSet containing the derived ATA addresses & ix set to initialize the accounts.
 */
async function resolveAtaForMints(ctx, params) {
    const { mints, receiver, payer, accountExemption } = params;
    const receiverKey = receiver ?? ctx.wallet.publicKey;
    const payerKey = payer ?? ctx.wallet.publicKey;
    const resolvedAtaResults = await (0, common_sdk_1.resolveOrCreateATAs)(ctx.connection, receiverKey, mints.map((tokenMint) => {
        return { tokenMint };
    }), async () => accountExemption, payerKey, undefined, // use default
    ctx.accountResolverOpts.allowPDAOwnerAddress, ctx.accountResolverOpts.createWrappedSolAccountMethod);
    // Convert the results back into the specified format
    const { resolveAtaIxs, resolvedAtas } = resolvedAtaResults.reduce((accu, curr) => {
        const { address, ...ix } = curr;
        accu.resolvedAtas.push(address);
        // TODO: common-sdk needs to have an easier way to check for empty instruction
        if (ix.instructions.length) {
            accu.resolveAtaIxs.push(ix);
        }
        return accu;
    }, { resolvedAtas: [], resolveAtaIxs: [] });
    const affliatedTokenAtaMap = (0, txn_utils_1.convertListToMap)(resolvedAtas, mints.map((mint) => mint.toBase58()));
    return {
        ataTokenAddresses: affliatedTokenAtaMap,
        resolveAtaIxs,
    };
}
exports.resolveAtaForMints = resolveAtaForMints;
/**
 * Add native WSOL mint handling to a transaction builder.
 */
function addNativeMintHandlingIx(txBuilder, affliatedTokenAtaMap, destinationWallet, accountExemption, createAccountMethod) {
    let { address: wSOLAta, ...resolveWSolIx } = common_sdk_1.TokenUtil.createWrappedNativeAccountInstruction(destinationWallet, common_sdk_1.ZERO, accountExemption, undefined, // use default
    undefined, // use default
    createAccountMethod);
    affliatedTokenAtaMap[spl_token_1.NATIVE_MINT.toBase58()] = wSOLAta;
    txBuilder.prependInstruction(resolveWSolIx);
}
exports.addNativeMintHandlingIx = addNativeMintHandlingIx;

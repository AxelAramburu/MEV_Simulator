"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.collectAllForPositionsTxns = exports.collectAllForPositionAddressesTxns = void 0;
const common_sdk_1 = require("@orca-so/common-sdk");
const spl_token_1 = require("@solana/spl-token");
const web3_js_1 = require("@solana/web3.js");
const ix_1 = require("../../ix");
const fetcher_1 = require("../../network/public/fetcher");
const public_1 = require("../../utils/public");
const txn_utils_1 = require("../../utils/txn-utils");
const whirlpool_ata_utils_1 = require("../../utils/whirlpool-ata-utils");
const update_fees_and_rewards_ix_1 = require("../update-fees-and-rewards-ix");
/**
 * Build a set of transactions to collect fees and rewards for a set of Whirlpool Positions.
 *
 * @category Instructions
 * @experimental
 * @param ctx - WhirlpoolContext object for the current environment.
 * @param params - CollectAllPositionAddressParams object
 * @param opts an {@link WhirlpoolAccountFetchOptions} object to define fetch and cache options when accessing on-chain accounts
 * @returns A set of transaction-builders to resolve ATA for affliated tokens, collect fee & rewards for all positions.
 */
async function collectAllForPositionAddressesTxns(ctx, params, opts = fetcher_1.PREFER_CACHE) {
    const { positions, ...rest } = params;
    const fetchedPositions = await ctx.fetcher.getPositions(positions, opts);
    const positionMap = {};
    fetchedPositions.forEach((pos, addr) => {
        if (pos) {
            positionMap[addr] = pos;
        }
    });
    return collectAllForPositionsTxns(ctx, { positions: positionMap, ...rest });
}
exports.collectAllForPositionAddressesTxns = collectAllForPositionAddressesTxns;
/**
 * Build a set of transactions to collect fees and rewards for a set of Whirlpool Positions.
 *
 * @experimental
 * @param ctx - WhirlpoolContext object for the current environment.
 * @param params - CollectAllPositionParams object
 * @returns A set of transaction-builders to resolve ATA for affliated tokens, collect fee & rewards for all positions.
 */
async function collectAllForPositionsTxns(ctx, params) {
    const { positions, receiver, positionAuthority, positionOwner, payer } = params;
    const receiverKey = receiver ?? ctx.wallet.publicKey;
    const positionAuthorityKey = positionAuthority ?? ctx.wallet.publicKey;
    const positionOwnerKey = positionOwner ?? ctx.wallet.publicKey;
    const payerKey = payer ?? ctx.wallet.publicKey;
    const positionList = Object.entries(positions);
    if (positionList.length === 0) {
        return [];
    }
    const whirlpoolAddrs = positionList.map(([, pos]) => pos.whirlpool.toBase58());
    const whirlpools = await ctx.fetcher.getPools(whirlpoolAddrs, fetcher_1.PREFER_CACHE);
    const allMints = (0, whirlpool_ata_utils_1.getTokenMintsFromWhirlpools)(Array.from(whirlpools.values()));
    const accountExemption = await ctx.fetcher.getAccountRentExempt();
    // resolvedAtas[mint] => Instruction & { address }
    // if already ATA exists, Instruction will be EMPTY_INSTRUCTION
    const resolvedAtas = (0, txn_utils_1.convertListToMap)(await (0, common_sdk_1.resolveOrCreateATAs)(ctx.connection, receiverKey, allMints.mintMap.map((tokenMint) => ({ tokenMint })), async () => accountExemption, payerKey, true, // CreateIdempotent
    ctx.accountResolverOpts.allowPDAOwnerAddress, ctx.accountResolverOpts.createWrappedSolAccountMethod), allMints.mintMap.map((mint) => mint.toBase58()));
    const latestBlockhash = await ctx.connection.getLatestBlockhash();
    const txBuilders = [];
    let posIndex = 0;
    let pendingTxBuilder = null;
    let touchedMints = null;
    let reattempt = false;
    while (posIndex < positionList.length) {
        if (!pendingTxBuilder || !touchedMints) {
            pendingTxBuilder = new common_sdk_1.TransactionBuilder(ctx.connection, ctx.wallet, ctx.txBuilderOpts);
            touchedMints = new Set();
            resolvedAtas[spl_token_1.NATIVE_MINT.toBase58()] = common_sdk_1.TokenUtil.createWrappedNativeAccountInstruction(receiverKey, common_sdk_1.ZERO, accountExemption, undefined, // use default
            undefined, // use default
            ctx.accountResolverOpts.createWrappedSolAccountMethod);
        }
        // Build collect instructions
        const [positionAddr, position] = positionList[posIndex];
        const collectIxForPosition = constructCollectIxForPosition(ctx, new web3_js_1.PublicKey(positionAddr), position, whirlpools, positionOwnerKey, positionAuthorityKey, resolvedAtas, touchedMints);
        const positionTxBuilder = new common_sdk_1.TransactionBuilder(ctx.connection, ctx.wallet, ctx.txBuilderOpts);
        positionTxBuilder.addInstructions(collectIxForPosition);
        // Attempt to push the new instructions into the pending builder
        // Iterate to the next position if possible
        // Create a builder and reattempt if the current one is full.
        const mergeable = await (0, txn_utils_1.checkMergedTransactionSizeIsValid)(ctx, [pendingTxBuilder, positionTxBuilder], latestBlockhash);
        if (mergeable) {
            pendingTxBuilder.addInstruction(positionTxBuilder.compressIx(false));
            posIndex += 1;
            reattempt = false;
        }
        else {
            if (reattempt) {
                throw new Error(`Unable to fit collection ix for ${position.positionMint.toBase58()} in a Transaction.`);
            }
            txBuilders.push(pendingTxBuilder);
            pendingTxBuilder = null;
            touchedMints = null;
            reattempt = true;
        }
    }
    if (pendingTxBuilder) {
        txBuilders.push(pendingTxBuilder);
    }
    return txBuilders;
}
exports.collectAllForPositionsTxns = collectAllForPositionsTxns;
// TODO: Once individual collect ix for positions is implemented, maybe migrate over if it can take custom ATA?
const constructCollectIxForPosition = (ctx, positionKey, position, whirlpools, positionOwner, positionAuthority, resolvedAtas, touchedMints) => {
    const ixForPosition = [];
    const { whirlpool: whirlpoolKey, liquidity, tickLowerIndex, tickUpperIndex, positionMint, rewardInfos: positionRewardInfos, } = position;
    const whirlpool = whirlpools.get(whirlpoolKey.toBase58());
    if (!whirlpool) {
        throw new Error(`Unable to process positionMint ${positionMint} - unable to derive whirlpool ${whirlpoolKey.toBase58()}`);
    }
    const { tickSpacing } = whirlpool;
    const mintA = whirlpool.tokenMintA.toBase58();
    const mintB = whirlpool.tokenMintB.toBase58();
    const positionTokenAccount = (0, spl_token_1.getAssociatedTokenAddressSync)(positionMint, positionOwner, ctx.accountResolverOpts.allowPDAOwnerAddress);
    // Update fee and reward values if necessary
    if (!liquidity.eq(common_sdk_1.ZERO)) {
        ixForPosition.push((0, update_fees_and_rewards_ix_1.updateFeesAndRewardsIx)(ctx.program, {
            position: positionKey,
            whirlpool: whirlpoolKey,
            tickArrayLower: public_1.PDAUtil.getTickArray(ctx.program.programId, whirlpoolKey, public_1.TickUtil.getStartTickIndex(tickLowerIndex, tickSpacing)).publicKey,
            tickArrayUpper: public_1.PDAUtil.getTickArray(ctx.program.programId, whirlpoolKey, public_1.TickUtil.getStartTickIndex(tickUpperIndex, tickSpacing)).publicKey,
        }));
    }
    // Collect Fee
    if (!touchedMints.has(mintA)) {
        ixForPosition.push(resolvedAtas[mintA]);
        touchedMints.add(mintA);
    }
    if (!touchedMints.has(mintB)) {
        ixForPosition.push(resolvedAtas[mintB]);
        touchedMints.add(mintB);
    }
    ixForPosition.push(ix_1.WhirlpoolIx.collectFeesIx(ctx.program, {
        whirlpool: whirlpoolKey,
        position: positionKey,
        positionAuthority,
        positionTokenAccount,
        tokenOwnerAccountA: resolvedAtas[mintA].address,
        tokenOwnerAccountB: resolvedAtas[mintB].address,
        tokenVaultA: whirlpool.tokenVaultA,
        tokenVaultB: whirlpool.tokenVaultB,
    }));
    // Collect Rewards
    // TODO: handle empty vault values?
    positionRewardInfos.forEach((_, index) => {
        const rewardInfo = whirlpool.rewardInfos[index];
        if (public_1.PoolUtil.isRewardInitialized(rewardInfo)) {
            const mintReward = rewardInfo.mint.toBase58();
            if (!touchedMints.has(mintReward)) {
                ixForPosition.push(resolvedAtas[mintReward]);
                touchedMints.add(mintReward);
            }
            ixForPosition.push(ix_1.WhirlpoolIx.collectRewardIx(ctx.program, {
                whirlpool: whirlpoolKey,
                position: positionKey,
                positionAuthority,
                positionTokenAccount,
                rewardIndex: index,
                rewardOwnerAccount: resolvedAtas[mintReward].address,
                rewardVault: rewardInfo.vault,
            }));
        }
    });
    return ixForPosition;
};

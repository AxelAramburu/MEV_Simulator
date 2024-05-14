"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WhirlpoolImpl = void 0;
const anchor_1 = require("@coral-xyz/anchor");
const common_sdk_1 = require("@orca-so/common-sdk");
const spl_token_1 = require("@solana/spl-token");
const web3_js_1 = require("@solana/web3.js");
const tiny_invariant_1 = __importDefault(require("tiny-invariant"));
const instructions_1 = require("../instructions");
const fetcher_1 = require("../network/public/fetcher");
const public_1 = require("../quotes/public");
const position_builder_util_1 = require("../utils/builder/position-builder-util");
const public_2 = require("../utils/public");
const whirlpool_ata_utils_1 = require("../utils/whirlpool-ata-utils");
const position_impl_1 = require("./position-impl");
const util_1 = require("./util");
const txn_utils_1 = require("../utils/txn-utils");
class WhirlpoolImpl {
    constructor(ctx, address, tokenAInfo, tokenBInfo, tokenVaultAInfo, tokenVaultBInfo, rewardInfos, data) {
        this.ctx = ctx;
        this.address = address;
        this.tokenAInfo = tokenAInfo;
        this.tokenBInfo = tokenBInfo;
        this.tokenVaultAInfo = tokenVaultAInfo;
        this.tokenVaultBInfo = tokenVaultBInfo;
        this.rewardInfos = rewardInfos;
        this.data = data;
    }
    getAddress() {
        return this.address;
    }
    getData() {
        return this.data;
    }
    getTokenAInfo() {
        return this.tokenAInfo;
    }
    getTokenBInfo() {
        return this.tokenBInfo;
    }
    getTokenVaultAInfo() {
        return this.tokenVaultAInfo;
    }
    getTokenVaultBInfo() {
        return this.tokenVaultBInfo;
    }
    getRewardInfos() {
        return this.rewardInfos;
    }
    async refreshData() {
        await this.refresh();
        return this.data;
    }
    async openPosition(tickLower, tickUpper, liquidityInput, wallet, funder, positionMint) {
        await this.refresh();
        return this.getOpenPositionWithOptMetadataTx(tickLower, tickUpper, liquidityInput, !!wallet ? common_sdk_1.AddressUtil.toPubKey(wallet) : this.ctx.wallet.publicKey, !!funder ? common_sdk_1.AddressUtil.toPubKey(funder) : this.ctx.wallet.publicKey, false, positionMint);
    }
    async openPositionWithMetadata(tickLower, tickUpper, liquidityInput, sourceWallet, funder, positionMint) {
        await this.refresh();
        return this.getOpenPositionWithOptMetadataTx(tickLower, tickUpper, liquidityInput, !!sourceWallet ? common_sdk_1.AddressUtil.toPubKey(sourceWallet) : this.ctx.wallet.publicKey, !!funder ? common_sdk_1.AddressUtil.toPubKey(funder) : this.ctx.wallet.publicKey, true, positionMint);
    }
    async initTickArrayForTicks(ticks, funder, opts = fetcher_1.IGNORE_CACHE) {
        const initTickArrayStartPdas = await public_2.TickArrayUtil.getUninitializedArraysPDAs(ticks, this.ctx.program.programId, this.address, this.data.tickSpacing, this.ctx.fetcher, opts);
        if (!initTickArrayStartPdas.length) {
            return null;
        }
        const txBuilder = new common_sdk_1.TransactionBuilder(this.ctx.provider.connection, this.ctx.provider.wallet, this.ctx.txBuilderOpts);
        initTickArrayStartPdas.forEach((initTickArrayInfo) => {
            txBuilder.addInstruction((0, instructions_1.initTickArrayIx)(this.ctx.program, {
                startTick: initTickArrayInfo.startIndex,
                tickArrayPda: initTickArrayInfo.pda,
                whirlpool: this.address,
                funder: !!funder ? common_sdk_1.AddressUtil.toPubKey(funder) : this.ctx.provider.wallet.publicKey,
            }));
        });
        return txBuilder;
    }
    async closePosition(positionAddress, slippageTolerance, destinationWallet, positionWallet, payer) {
        await this.refresh();
        const positionWalletKey = positionWallet
            ? common_sdk_1.AddressUtil.toPubKey(positionWallet)
            : this.ctx.wallet.publicKey;
        const destinationWalletKey = destinationWallet
            ? common_sdk_1.AddressUtil.toPubKey(destinationWallet)
            : this.ctx.wallet.publicKey;
        const payerKey = payer ? common_sdk_1.AddressUtil.toPubKey(payer) : this.ctx.wallet.publicKey;
        return this.getClosePositionIx(common_sdk_1.AddressUtil.toPubKey(positionAddress), slippageTolerance, destinationWalletKey, positionWalletKey, payerKey);
    }
    async swap(quote, sourceWallet) {
        const sourceWalletKey = sourceWallet
            ? common_sdk_1.AddressUtil.toPubKey(sourceWallet)
            : this.ctx.wallet.publicKey;
        return (0, instructions_1.swapAsync)(this.ctx, {
            swapInput: quote,
            whirlpool: this,
            wallet: sourceWalletKey,
        }, fetcher_1.IGNORE_CACHE);
    }
    async swapWithDevFees(quote, devFeeWallet, wallet, payer) {
        const sourceWalletKey = wallet ? common_sdk_1.AddressUtil.toPubKey(wallet) : this.ctx.wallet.publicKey;
        const payerKey = payer ? common_sdk_1.AddressUtil.toPubKey(payer) : this.ctx.wallet.publicKey;
        const txBuilder = new common_sdk_1.TransactionBuilder(this.ctx.provider.connection, this.ctx.provider.wallet, this.ctx.txBuilderOpts);
        if (!quote.devFeeAmount.eq(common_sdk_1.ZERO)) {
            const inputToken = quote.aToB === quote.amountSpecifiedIsInput ? this.getTokenAInfo() : this.getTokenBInfo();
            txBuilder.addInstruction(await common_sdk_1.TokenUtil.createSendTokensToWalletInstruction(this.ctx.connection, sourceWalletKey, devFeeWallet, inputToken.mint, inputToken.decimals, quote.devFeeAmount, () => this.ctx.fetcher.getAccountRentExempt(), payerKey, this.ctx.accountResolverOpts.allowPDAOwnerAddress));
        }
        const swapTxBuilder = await (0, instructions_1.swapAsync)(this.ctx, {
            swapInput: quote,
            whirlpool: this,
            wallet: sourceWalletKey,
        }, fetcher_1.IGNORE_CACHE);
        txBuilder.addInstruction(swapTxBuilder.compressIx(true));
        return txBuilder;
    }
    /**
     * Construct a transaction for opening an new position with optional metadata
     */
    async getOpenPositionWithOptMetadataTx(tickLower, tickUpper, liquidityInput, wallet, funder, withMetadata = false, positionMint) {
        (0, tiny_invariant_1.default)(public_2.TickUtil.checkTickInBounds(tickLower), "tickLower is out of bounds.");
        (0, tiny_invariant_1.default)(public_2.TickUtil.checkTickInBounds(tickUpper), "tickUpper is out of bounds.");
        const { liquidityAmount: liquidity, tokenMaxA, tokenMaxB } = liquidityInput;
        (0, tiny_invariant_1.default)(liquidity.gt(new anchor_1.BN(0)), "liquidity must be greater than zero");
        const whirlpool = await this.ctx.fetcher.getPool(this.address, fetcher_1.PREFER_CACHE);
        if (!whirlpool) {
            throw new Error(`Whirlpool not found: ${(0, anchor_1.translateAddress)(this.address).toBase58()}`);
        }
        (0, tiny_invariant_1.default)(public_2.TickUtil.isTickInitializable(tickLower, whirlpool.tickSpacing), `lower tick ${tickLower} is not an initializable tick for tick-spacing ${whirlpool.tickSpacing}`);
        (0, tiny_invariant_1.default)(public_2.TickUtil.isTickInitializable(tickUpper, whirlpool.tickSpacing), `upper tick ${tickUpper} is not an initializable tick for tick-spacing ${whirlpool.tickSpacing}`);
        const positionMintKeypair = web3_js_1.Keypair.generate();
        const positionMintPubkey = positionMint ?? positionMintKeypair.publicKey;
        const positionPda = public_2.PDAUtil.getPosition(this.ctx.program.programId, positionMintPubkey);
        const metadataPda = public_2.PDAUtil.getPositionMetadata(positionMintPubkey);
        const positionTokenAccountAddress = (0, spl_token_1.getAssociatedTokenAddressSync)(positionMintPubkey, wallet, this.ctx.accountResolverOpts.allowPDAOwnerAddress);
        const txBuilder = new common_sdk_1.TransactionBuilder(this.ctx.provider.connection, this.ctx.provider.wallet, this.ctx.txBuilderOpts);
        const positionIx = (withMetadata ? instructions_1.openPositionWithMetadataIx : instructions_1.openPositionIx)(this.ctx.program, {
            funder,
            owner: wallet,
            positionPda,
            metadataPda,
            positionMintAddress: positionMintPubkey,
            positionTokenAccount: positionTokenAccountAddress,
            whirlpool: this.address,
            tickLowerIndex: tickLower,
            tickUpperIndex: tickUpper,
        });
        txBuilder.addInstruction(positionIx);
        if (positionMint === undefined) {
            txBuilder.addSigner(positionMintKeypair);
        }
        const [ataA, ataB] = await (0, common_sdk_1.resolveOrCreateATAs)(this.ctx.connection, wallet, [
            { tokenMint: whirlpool.tokenMintA, wrappedSolAmountIn: tokenMaxA },
            { tokenMint: whirlpool.tokenMintB, wrappedSolAmountIn: tokenMaxB },
        ], () => this.ctx.fetcher.getAccountRentExempt(), funder, undefined, // use default
        this.ctx.accountResolverOpts.allowPDAOwnerAddress, this.ctx.accountResolverOpts.createWrappedSolAccountMethod);
        const { address: tokenOwnerAccountA, ...tokenOwnerAccountAIx } = ataA;
        const { address: tokenOwnerAccountB, ...tokenOwnerAccountBIx } = ataB;
        txBuilder.addInstruction(tokenOwnerAccountAIx);
        txBuilder.addInstruction(tokenOwnerAccountBIx);
        const tickArrayLowerPda = public_2.PDAUtil.getTickArrayFromTickIndex(tickLower, this.data.tickSpacing, this.address, this.ctx.program.programId);
        const tickArrayUpperPda = public_2.PDAUtil.getTickArrayFromTickIndex(tickUpper, this.data.tickSpacing, this.address, this.ctx.program.programId);
        const liquidityIx = (0, instructions_1.increaseLiquidityIx)(this.ctx.program, {
            liquidityAmount: liquidity,
            tokenMaxA,
            tokenMaxB,
            whirlpool: this.address,
            positionAuthority: wallet,
            position: positionPda.publicKey,
            positionTokenAccount: positionTokenAccountAddress,
            tokenOwnerAccountA,
            tokenOwnerAccountB,
            tokenVaultA: whirlpool.tokenVaultA,
            tokenVaultB: whirlpool.tokenVaultB,
            tickArrayLower: tickArrayLowerPda.publicKey,
            tickArrayUpper: tickArrayUpperPda.publicKey,
        });
        txBuilder.addInstruction(liquidityIx);
        return {
            positionMint: positionMintPubkey,
            tx: txBuilder,
        };
    }
    async getClosePositionIx(positionAddress, slippageTolerance, destinationWallet, positionWallet, payerKey) {
        const positionData = await this.ctx.fetcher.getPosition(positionAddress, fetcher_1.IGNORE_CACHE);
        if (!positionData) {
            throw new Error(`Position not found: ${positionAddress.toBase58()}`);
        }
        const whirlpool = this.data;
        (0, tiny_invariant_1.default)(positionData.whirlpool.equals(this.address), `Position ${positionAddress.toBase58()} is not a position for Whirlpool ${this.address.toBase58()}`);
        const positionTokenAccount = (0, spl_token_1.getAssociatedTokenAddressSync)(positionData.positionMint, positionWallet, this.ctx.accountResolverOpts.allowPDAOwnerAddress);
        const tokenAccountsTxBuilder = new common_sdk_1.TransactionBuilder(this.ctx.provider.connection, this.ctx.provider.wallet, this.ctx.txBuilderOpts);
        const accountExemption = await this.ctx.fetcher.getAccountRentExempt();
        const txBuilder = new common_sdk_1.TransactionBuilder(this.ctx.provider.connection, this.ctx.provider.wallet, this.ctx.txBuilderOpts);
        const tickArrayLower = public_2.PDAUtil.getTickArrayFromTickIndex(positionData.tickLowerIndex, whirlpool.tickSpacing, positionData.whirlpool, this.ctx.program.programId).publicKey;
        const tickArrayUpper = public_2.PDAUtil.getTickArrayFromTickIndex(positionData.tickUpperIndex, whirlpool.tickSpacing, positionData.whirlpool, this.ctx.program.programId).publicKey;
        const [tickArrayLowerData, tickArrayUpperData] = await (0, position_builder_util_1.getTickArrayDataForPosition)(this.ctx, positionData, whirlpool, fetcher_1.IGNORE_CACHE);
        (0, tiny_invariant_1.default)(!!tickArrayLowerData, `Tick array ${tickArrayLower} expected to be initialized for whirlpool ${this.address}`);
        (0, tiny_invariant_1.default)(!!tickArrayUpperData, `Tick array ${tickArrayUpper} expected to be initialized for whirlpool ${this.address}`);
        const position = new position_impl_1.PositionImpl(this.ctx, positionAddress, positionData, whirlpool, tickArrayLowerData, tickArrayUpperData);
        const tickLower = position.getLowerTickData();
        const tickUpper = position.getUpperTickData();
        const feesQuote = (0, public_1.collectFeesQuote)({
            position: positionData,
            whirlpool,
            tickLower,
            tickUpper,
        });
        const rewardsQuote = (0, public_1.collectRewardsQuote)({
            position: positionData,
            whirlpool,
            tickLower,
            tickUpper,
        });
        const shouldCollectFees = feesQuote.feeOwedA.gtn(0) || feesQuote.feeOwedB.gtn(0);
        (0, tiny_invariant_1.default)(this.data.rewardInfos.length === rewardsQuote.length, "Rewards quote does not match reward infos length");
        const shouldDecreaseLiquidity = positionData.liquidity.gtn(0);
        const rewardsToCollect = this.data.rewardInfos
            .filter((_, i) => (rewardsQuote[i] ?? common_sdk_1.ZERO).gtn(0))
            .map((info) => info.mint);
        const shouldCollectRewards = rewardsToCollect.length > 0;
        let mintType = whirlpool_ata_utils_1.TokenMintTypes.ALL;
        if ((shouldDecreaseLiquidity || shouldCollectFees) && !shouldCollectRewards) {
            mintType = whirlpool_ata_utils_1.TokenMintTypes.POOL_ONLY;
        }
        else if (!(shouldDecreaseLiquidity || shouldCollectFees) && shouldCollectRewards) {
            mintType = whirlpool_ata_utils_1.TokenMintTypes.REWARD_ONLY;
        }
        const affiliatedMints = (0, whirlpool_ata_utils_1.getTokenMintsFromWhirlpools)([whirlpool], mintType);
        const { ataTokenAddresses: walletTokenAccountsByMint, resolveAtaIxs } = await (0, whirlpool_ata_utils_1.resolveAtaForMints)(this.ctx, {
            mints: affiliatedMints.mintMap,
            accountExemption,
            receiver: destinationWallet,
            payer: payerKey,
        });
        tokenAccountsTxBuilder.addInstructions(resolveAtaIxs);
        // Handle native mint
        if (affiliatedMints.hasNativeMint) {
            let { address: wSOLAta, ...resolveWSolIx } = common_sdk_1.TokenUtil.createWrappedNativeAccountInstruction(destinationWallet, common_sdk_1.ZERO, accountExemption, payerKey, destinationWallet, this.ctx.accountResolverOpts.createWrappedSolAccountMethod);
            walletTokenAccountsByMint[spl_token_1.NATIVE_MINT.toBase58()] = wSOLAta;
            txBuilder.addInstruction(resolveWSolIx);
        }
        if (shouldDecreaseLiquidity) {
            /* Remove all liquidity remaining in the position */
            const tokenOwnerAccountA = walletTokenAccountsByMint[whirlpool.tokenMintA.toBase58()];
            const tokenOwnerAccountB = walletTokenAccountsByMint[whirlpool.tokenMintB.toBase58()];
            const decreaseLiqQuote = (0, public_1.decreaseLiquidityQuoteByLiquidityWithParams)({
                liquidity: positionData.liquidity,
                slippageTolerance,
                sqrtPrice: whirlpool.sqrtPrice,
                tickCurrentIndex: whirlpool.tickCurrentIndex,
                tickLowerIndex: positionData.tickLowerIndex,
                tickUpperIndex: positionData.tickUpperIndex,
            });
            const liquidityIx = (0, instructions_1.decreaseLiquidityIx)(this.ctx.program, {
                ...decreaseLiqQuote,
                whirlpool: positionData.whirlpool,
                positionAuthority: positionWallet,
                position: positionAddress,
                positionTokenAccount,
                tokenOwnerAccountA,
                tokenOwnerAccountB,
                tokenVaultA: whirlpool.tokenVaultA,
                tokenVaultB: whirlpool.tokenVaultB,
                tickArrayLower,
                tickArrayUpper,
            });
            txBuilder.addInstruction(liquidityIx);
        }
        if (shouldCollectFees) {
            const collectFeexTx = await position.collectFees(false, walletTokenAccountsByMint, destinationWallet, positionWallet, payerKey, fetcher_1.IGNORE_CACHE);
            txBuilder.addInstruction(collectFeexTx.compressIx(false));
        }
        if (shouldCollectRewards) {
            const collectRewardsTx = await position.collectRewards(rewardsToCollect, false, walletTokenAccountsByMint, destinationWallet, positionWallet, payerKey);
            txBuilder.addInstruction(collectRewardsTx.compressIx(false));
        }
        /* Close position */
        const positionIx = (0, instructions_1.closePositionIx)(this.ctx.program, {
            positionAuthority: positionWallet,
            receiver: destinationWallet,
            positionTokenAccount,
            position: positionAddress,
            positionMint: positionData.positionMint,
        });
        txBuilder.addInstruction(positionIx);
        if (tokenAccountsTxBuilder.isEmpty()) {
            return [txBuilder];
        }
        // This handles an edge case where the instructions are too
        // large to fit in a single transaction and we need to split the
        // instructions into two transactions.
        const canFitInOneTransaction = await (0, txn_utils_1.checkMergedTransactionSizeIsValid)(this.ctx, [tokenAccountsTxBuilder, txBuilder], common_sdk_1.MEASUREMENT_BLOCKHASH);
        if (!canFitInOneTransaction) {
            return [tokenAccountsTxBuilder, txBuilder];
        }
        tokenAccountsTxBuilder.addInstruction(txBuilder.compressIx(false));
        return [tokenAccountsTxBuilder];
    }
    async refresh() {
        const account = await this.ctx.fetcher.getPool(this.address, fetcher_1.IGNORE_CACHE);
        if (!!account) {
            const rewardInfos = await (0, util_1.getRewardInfos)(this.ctx.fetcher, account, fetcher_1.IGNORE_CACHE);
            const [tokenVaultAInfo, tokenVaultBInfo] = await (0, util_1.getTokenVaultAccountInfos)(this.ctx.fetcher, account, fetcher_1.IGNORE_CACHE);
            this.data = account;
            this.tokenVaultAInfo = tokenVaultAInfo;
            this.tokenVaultBInfo = tokenVaultBInfo;
            this.rewardInfos = rewardInfos;
        }
    }
}
exports.WhirlpoolImpl = WhirlpoolImpl;

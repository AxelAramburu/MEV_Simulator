"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WhirlpoolClientImpl = void 0;
const common_sdk_1 = require("@orca-so/common-sdk");
const web3_js_1 = require("@solana/web3.js");
const tiny_invariant_1 = __importDefault(require("tiny-invariant"));
const instructions_1 = require("../instructions");
const composites_1 = require("../instructions/composites");
const ix_1 = require("../ix");
const fetcher_1 = require("../network/public/fetcher");
const public_1 = require("../router/public");
const position_builder_util_1 = require("../utils/builder/position-builder-util");
const public_2 = require("../utils/public");
const position_impl_1 = require("./position-impl");
const util_1 = require("./util");
const whirlpool_impl_1 = require("./whirlpool-impl");
class WhirlpoolClientImpl {
    constructor(ctx) {
        this.ctx = ctx;
    }
    getContext() {
        return this.ctx;
    }
    getFetcher() {
        return this.ctx.fetcher;
    }
    getRouter(poolAddresses) {
        return public_1.WhirlpoolRouterBuilder.buildWithPools(this.ctx, poolAddresses);
    }
    async getPool(poolAddress, opts = fetcher_1.PREFER_CACHE) {
        const account = await this.ctx.fetcher.getPool(poolAddress, opts);
        if (!account) {
            throw new Error(`Unable to fetch Whirlpool at address at ${poolAddress}`);
        }
        const tokenInfos = await (0, util_1.getTokenMintInfos)(this.ctx.fetcher, account, opts);
        const vaultInfos = await (0, util_1.getTokenVaultAccountInfos)(this.ctx.fetcher, account, opts);
        const rewardInfos = await (0, util_1.getRewardInfos)(this.ctx.fetcher, account, opts);
        return new whirlpool_impl_1.WhirlpoolImpl(this.ctx, common_sdk_1.AddressUtil.toPubKey(poolAddress), tokenInfos[0], tokenInfos[1], vaultInfos[0], vaultInfos[1], rewardInfos, account);
    }
    async getPools(poolAddresses, opts = fetcher_1.PREFER_CACHE) {
        const accounts = Array.from((await this.ctx.fetcher.getPools(poolAddresses, opts)).values()).filter((account) => !!account);
        if (accounts.length !== poolAddresses.length) {
            throw new Error(`Unable to fetch all Whirlpools at addresses ${poolAddresses}`);
        }
        const tokenMints = new Set();
        const tokenAccounts = new Set();
        accounts.forEach((account) => {
            tokenMints.add(account.tokenMintA.toBase58());
            tokenMints.add(account.tokenMintB.toBase58());
            tokenAccounts.add(account.tokenVaultA.toBase58());
            tokenAccounts.add(account.tokenVaultB.toBase58());
            account.rewardInfos.forEach((rewardInfo) => {
                if (public_2.PoolUtil.isRewardInitialized(rewardInfo)) {
                    tokenAccounts.add(rewardInfo.vault.toBase58());
                }
            });
        });
        await this.ctx.fetcher.getMintInfos(Array.from(tokenMints), opts);
        await this.ctx.fetcher.getTokenInfos(Array.from(tokenAccounts), opts);
        const whirlpools = [];
        for (let i = 0; i < accounts.length; i++) {
            const account = accounts[i];
            const poolAddress = poolAddresses[i];
            const tokenInfos = await (0, util_1.getTokenMintInfos)(this.ctx.fetcher, account, fetcher_1.PREFER_CACHE);
            const vaultInfos = await (0, util_1.getTokenVaultAccountInfos)(this.ctx.fetcher, account, fetcher_1.PREFER_CACHE);
            const rewardInfos = await (0, util_1.getRewardInfos)(this.ctx.fetcher, account, fetcher_1.PREFER_CACHE);
            whirlpools.push(new whirlpool_impl_1.WhirlpoolImpl(this.ctx, common_sdk_1.AddressUtil.toPubKey(poolAddress), tokenInfos[0], tokenInfos[1], vaultInfos[0], vaultInfos[1], rewardInfos, account));
        }
        return whirlpools;
    }
    async getPosition(positionAddress, opts = fetcher_1.PREFER_CACHE) {
        const account = await this.ctx.fetcher.getPosition(positionAddress, opts);
        if (!account) {
            throw new Error(`Unable to fetch Position at address at ${positionAddress}`);
        }
        const whirlAccount = await this.ctx.fetcher.getPool(account.whirlpool, opts);
        if (!whirlAccount) {
            throw new Error(`Unable to fetch Whirlpool for Position at address at ${positionAddress}`);
        }
        const [lowerTickArray, upperTickArray] = await (0, position_builder_util_1.getTickArrayDataForPosition)(this.ctx, account, whirlAccount, opts);
        if (!lowerTickArray || !upperTickArray) {
            throw new Error(`Unable to fetch TickArrays for Position at address at ${positionAddress}`);
        }
        return new position_impl_1.PositionImpl(this.ctx, common_sdk_1.AddressUtil.toPubKey(positionAddress), account, whirlAccount, lowerTickArray, upperTickArray);
    }
    async getPositions(positionAddresses, opts = fetcher_1.PREFER_CACHE) {
        // TODO: Prefetch and use fetcher as a cache - Think of a cleaner way to prefetch
        const positions = Array.from((await this.ctx.fetcher.getPositions(positionAddresses, opts)).values());
        const whirlpoolAddrs = positions
            .map((position) => position?.whirlpool.toBase58())
            .flatMap((x) => (!!x ? x : []));
        await this.ctx.fetcher.getPools(whirlpoolAddrs, opts);
        const tickArrayAddresses = new Set();
        await Promise.all(positions.map(async (pos) => {
            if (pos) {
                const pool = await this.ctx.fetcher.getPool(pos.whirlpool, fetcher_1.PREFER_CACHE);
                if (pool) {
                    const lowerTickArrayPda = public_2.PDAUtil.getTickArrayFromTickIndex(pos.tickLowerIndex, pool.tickSpacing, pos.whirlpool, this.ctx.program.programId).publicKey;
                    const upperTickArrayPda = public_2.PDAUtil.getTickArrayFromTickIndex(pos.tickUpperIndex, pool.tickSpacing, pos.whirlpool, this.ctx.program.programId).publicKey;
                    tickArrayAddresses.add(lowerTickArrayPda.toBase58());
                    tickArrayAddresses.add(upperTickArrayPda.toBase58());
                }
            }
        }));
        await this.ctx.fetcher.getTickArrays(Array.from(tickArrayAddresses), fetcher_1.IGNORE_CACHE);
        // Use getPosition and the prefetched values to generate the Positions
        const results = await Promise.all(positionAddresses.map(async (pos) => {
            try {
                const position = await this.getPosition(pos, fetcher_1.PREFER_CACHE);
                return [pos, position];
            }
            catch {
                return [pos, null];
            }
        }));
        return Object.fromEntries(results);
    }
    async createPool(whirlpoolsConfig, tokenMintA, tokenMintB, tickSpacing, initialTick, funder, opts = fetcher_1.PREFER_CACHE) {
        (0, tiny_invariant_1.default)(public_2.TickUtil.checkTickInBounds(initialTick), "initialTick is out of bounds.");
        (0, tiny_invariant_1.default)(public_2.TickUtil.isTickInitializable(initialTick, tickSpacing), `initial tick ${initialTick} is not an initializable tick for tick-spacing ${tickSpacing}`);
        const correctTokenOrder = public_2.PoolUtil.orderMints(tokenMintA, tokenMintB).map((addr) => addr.toString());
        (0, tiny_invariant_1.default)(correctTokenOrder[0] === tokenMintA.toString(), "Token order needs to be flipped to match the canonical ordering (i.e. sorted on the byte repr. of the mint pubkeys)");
        whirlpoolsConfig = common_sdk_1.AddressUtil.toPubKey(whirlpoolsConfig);
        const feeTierKey = public_2.PDAUtil.getFeeTier(this.ctx.program.programId, whirlpoolsConfig, tickSpacing).publicKey;
        const initSqrtPrice = public_2.PriceMath.tickIndexToSqrtPriceX64(initialTick);
        const tokenVaultAKeypair = web3_js_1.Keypair.generate();
        const tokenVaultBKeypair = web3_js_1.Keypair.generate();
        const whirlpoolPda = public_2.PDAUtil.getWhirlpool(this.ctx.program.programId, whirlpoolsConfig, new web3_js_1.PublicKey(tokenMintA), new web3_js_1.PublicKey(tokenMintB), tickSpacing);
        const feeTier = await this.ctx.fetcher.getFeeTier(feeTierKey, opts);
        (0, tiny_invariant_1.default)(!!feeTier, `Fee tier for ${tickSpacing} doesn't exist`);
        const txBuilder = new common_sdk_1.TransactionBuilder(this.ctx.provider.connection, this.ctx.provider.wallet, this.ctx.txBuilderOpts);
        const initPoolIx = ix_1.WhirlpoolIx.initializePoolIx(this.ctx.program, {
            initSqrtPrice,
            whirlpoolsConfig,
            whirlpoolPda,
            tokenMintA: new web3_js_1.PublicKey(tokenMintA),
            tokenMintB: new web3_js_1.PublicKey(tokenMintB),
            tokenVaultAKeypair,
            tokenVaultBKeypair,
            feeTierKey,
            tickSpacing,
            funder: new web3_js_1.PublicKey(funder),
        });
        const initialTickArrayStartTick = public_2.TickUtil.getStartTickIndex(initialTick, tickSpacing);
        const initialTickArrayPda = public_2.PDAUtil.getTickArray(this.ctx.program.programId, whirlpoolPda.publicKey, initialTickArrayStartTick);
        txBuilder.addInstruction(initPoolIx);
        txBuilder.addInstruction((0, instructions_1.initTickArrayIx)(this.ctx.program, {
            startTick: initialTickArrayStartTick,
            tickArrayPda: initialTickArrayPda,
            whirlpool: whirlpoolPda.publicKey,
            funder: common_sdk_1.AddressUtil.toPubKey(funder),
        }));
        return {
            poolKey: whirlpoolPda.publicKey,
            tx: txBuilder,
        };
    }
    async collectFeesAndRewardsForPositions(positionAddresses, opts) {
        const walletKey = this.ctx.wallet.publicKey;
        return (0, composites_1.collectAllForPositionAddressesTxns)(this.ctx, {
            positions: positionAddresses,
            receiver: walletKey,
            positionAuthority: walletKey,
            positionOwner: walletKey,
            payer: walletKey,
        }, opts);
    }
    async collectProtocolFeesForPools(poolAddresses) {
        return (0, composites_1.collectProtocolFees)(this.ctx, poolAddresses);
    }
}
exports.WhirlpoolClientImpl = WhirlpoolClientImpl;

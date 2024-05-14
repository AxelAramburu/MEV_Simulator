"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.collectProtocolFees = void 0;
const common_sdk_1 = require("@orca-so/common-sdk");
const spl_token_1 = require("@solana/spl-token");
const web3_js_1 = require("@solana/web3.js");
const fetcher_1 = require("../../network/public/fetcher");
const whirlpool_ata_utils_1 = require("../../utils/whirlpool-ata-utils");
const collect_protocol_fees_ix_1 = require("../collect-protocol-fees-ix");
async function collectProtocolFees(ctx, poolAddresses) {
    const receiverKey = ctx.wallet.publicKey;
    const payerKey = ctx.wallet.publicKey;
    const whirlpoolDatas = Array.from((await ctx.fetcher.getPools(poolAddresses, fetcher_1.PREFER_CACHE)).values());
    const accountExemption = await ctx.fetcher.getAccountRentExempt();
    const { ataTokenAddresses, resolveAtaIxs } = await (0, whirlpool_ata_utils_1.resolveAtaForMints)(ctx, {
        mints: (0, whirlpool_ata_utils_1.getTokenMintsFromWhirlpools)(whirlpoolDatas, whirlpool_ata_utils_1.TokenMintTypes.POOL_ONLY).mintMap,
        accountExemption,
        receiver: receiverKey,
        payer: payerKey,
    });
    const latestBlockhash = await ctx.connection.getLatestBlockhash();
    let txBuilder = new common_sdk_1.TransactionBuilder(ctx.connection, ctx.wallet, ctx.txBuilderOpts).addInstructions(resolveAtaIxs);
    const instructions = [];
    for (const poolAddress of poolAddresses) {
        const pool = await ctx.fetcher.getPool(poolAddress);
        if (!pool) {
            throw new Error(`Pool not found: ${poolAddress}`);
        }
        const poolConfig = await ctx.fetcher.getConfig(pool.whirlpoolsConfig);
        if (!poolConfig) {
            throw new Error(`Config not found: ${pool.whirlpoolsConfig}`);
        }
        if (poolConfig.collectProtocolFeesAuthority.toBase58() !== ctx.wallet.publicKey.toBase58()) {
            throw new Error(`Wallet is not the collectProtocolFeesAuthority`);
        }
        const poolHandlesNativeMint = common_sdk_1.TokenUtil.isNativeMint(pool.tokenMintA) || common_sdk_1.TokenUtil.isNativeMint(pool.tokenMintB);
        const txBuilderHasNativeMint = !!ataTokenAddresses[spl_token_1.NATIVE_MINT.toBase58()];
        if (poolHandlesNativeMint && !txBuilderHasNativeMint) {
            (0, whirlpool_ata_utils_1.addNativeMintHandlingIx)(txBuilder, ataTokenAddresses, receiverKey, accountExemption, ctx.accountResolverOpts.createWrappedSolAccountMethod);
        }
        // add collect ixn
        instructions.push((0, collect_protocol_fees_ix_1.collectProtocolFeesIx)(ctx.program, {
            whirlpoolsConfig: pool.whirlpoolsConfig,
            whirlpool: common_sdk_1.AddressUtil.toPubKey(poolAddress),
            tokenVaultA: pool.tokenVaultA,
            tokenVaultB: pool.tokenVaultB,
            tokenOwnerAccountA: ataTokenAddresses[pool.tokenMintA.toBase58()],
            tokenOwnerAccountB: ataTokenAddresses[pool.tokenMintB.toBase58()],
            collectProtocolFeesAuthority: poolConfig.collectProtocolFeesAuthority,
        }));
    }
    txBuilder.addInstructions(instructions);
    const txSize = await txBuilder.txnSize({ latestBlockhash });
    if (txSize > web3_js_1.PACKET_DATA_SIZE) {
        throw new Error(`Transaction size is too large: ${txSize}`);
    }
    return txBuilder;
}
exports.collectProtocolFees = collectProtocolFees;

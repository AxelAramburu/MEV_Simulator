import { Address } from "@coral-xyz/anchor";
import { Percentage, TransactionBuilder } from "@orca-so/common-sdk";
import { PublicKey } from "@solana/web3.js";
import { WhirlpoolContext } from "../context";
import { DevFeeSwapInput, IncreaseLiquidityInput, SwapInput } from "../instructions";
import { TokenAccountInfo, TokenInfo, WhirlpoolData, WhirlpoolRewardInfo } from "../types/public";
import { Whirlpool } from "../whirlpool-client";
export declare class WhirlpoolImpl implements Whirlpool {
    readonly ctx: WhirlpoolContext;
    readonly address: PublicKey;
    readonly tokenAInfo: TokenInfo;
    readonly tokenBInfo: TokenInfo;
    private tokenVaultAInfo;
    private tokenVaultBInfo;
    private rewardInfos;
    private data;
    constructor(ctx: WhirlpoolContext, address: PublicKey, tokenAInfo: TokenInfo, tokenBInfo: TokenInfo, tokenVaultAInfo: TokenAccountInfo, tokenVaultBInfo: TokenAccountInfo, rewardInfos: WhirlpoolRewardInfo[], data: WhirlpoolData);
    getAddress(): PublicKey;
    getData(): WhirlpoolData;
    getTokenAInfo(): TokenInfo;
    getTokenBInfo(): TokenInfo;
    getTokenVaultAInfo(): TokenAccountInfo;
    getTokenVaultBInfo(): TokenAccountInfo;
    getRewardInfos(): WhirlpoolRewardInfo[];
    refreshData(): Promise<WhirlpoolData>;
    openPosition(tickLower: number, tickUpper: number, liquidityInput: IncreaseLiquidityInput, wallet?: Address, funder?: Address, positionMint?: PublicKey): Promise<{
        positionMint: PublicKey;
        tx: TransactionBuilder;
    }>;
    openPositionWithMetadata(tickLower: number, tickUpper: number, liquidityInput: IncreaseLiquidityInput, sourceWallet?: Address, funder?: Address, positionMint?: PublicKey): Promise<{
        positionMint: PublicKey;
        tx: TransactionBuilder;
    }>;
    initTickArrayForTicks(ticks: number[], funder?: Address, opts?: import("@orca-so/common-sdk").SimpleAccountFetchOptions): Promise<TransactionBuilder | null>;
    closePosition(positionAddress: Address, slippageTolerance: Percentage, destinationWallet?: Address, positionWallet?: Address, payer?: Address): Promise<TransactionBuilder[]>;
    swap(quote: SwapInput, sourceWallet?: Address): Promise<TransactionBuilder>;
    swapWithDevFees(quote: DevFeeSwapInput, devFeeWallet: PublicKey, wallet?: PublicKey | undefined, payer?: PublicKey | undefined): Promise<TransactionBuilder>;
    /**
     * Construct a transaction for opening an new position with optional metadata
     */
    getOpenPositionWithOptMetadataTx(tickLower: number, tickUpper: number, liquidityInput: IncreaseLiquidityInput, wallet: PublicKey, funder: PublicKey, withMetadata?: boolean, positionMint?: PublicKey): Promise<{
        positionMint: PublicKey;
        tx: TransactionBuilder;
    }>;
    getClosePositionIx(positionAddress: PublicKey, slippageTolerance: Percentage, destinationWallet: PublicKey, positionWallet: PublicKey, payerKey: PublicKey): Promise<TransactionBuilder[]>;
    private refresh;
}

import { Address } from "@coral-xyz/anchor";
import { TransactionBuilder } from "@orca-so/common-sdk";
import { PublicKey } from "@solana/web3.js";
import { WhirlpoolContext } from "../context";
import { DecreaseLiquidityInput, IncreaseLiquidityInput } from "../instructions";
import { WhirlpoolAccountFetchOptions } from "../network/public/fetcher";
import { PositionData, TickArrayData, TickData, WhirlpoolData } from "../types/public";
import { Position } from "../whirlpool-client";
export declare class PositionImpl implements Position {
    readonly ctx: WhirlpoolContext;
    readonly address: PublicKey;
    private data;
    private whirlpoolData;
    private lowerTickArrayData;
    private upperTickArrayData;
    constructor(ctx: WhirlpoolContext, address: PublicKey, data: PositionData, whirlpoolData: WhirlpoolData, lowerTickArrayData: TickArrayData, upperTickArrayData: TickArrayData);
    getAddress(): PublicKey;
    getData(): PositionData;
    getWhirlpoolData(): WhirlpoolData;
    getLowerTickData(): TickData;
    getUpperTickData(): TickData;
    refreshData(): Promise<PositionData>;
    increaseLiquidity(liquidityInput: IncreaseLiquidityInput, resolveATA?: boolean, sourceWallet?: Address, positionWallet?: Address, ataPayer?: Address): Promise<TransactionBuilder>;
    decreaseLiquidity(liquidityInput: DecreaseLiquidityInput, resolveATA?: boolean, sourceWallet?: Address, positionWallet?: Address, ataPayer?: Address): Promise<TransactionBuilder>;
    collectFees(updateFeesAndRewards?: boolean, ownerTokenAccountMap?: Partial<Record<string, Address>>, destinationWallet?: Address, positionWallet?: Address, ataPayer?: Address, opts?: WhirlpoolAccountFetchOptions): Promise<TransactionBuilder>;
    collectRewards(rewardsToCollect?: Address[], updateFeesAndRewards?: boolean, ownerTokenAccountMap?: Partial<Record<string, Address>>, destinationWallet?: Address, positionWallet?: Address, ataPayer?: Address, opts?: WhirlpoolAccountFetchOptions): Promise<TransactionBuilder>;
    private refresh;
    private updateFeesAndRewards;
}

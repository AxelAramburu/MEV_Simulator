import { Address } from "@coral-xyz/anchor";
import { TransactionBuilder } from "@orca-so/common-sdk";
import { PublicKey } from "@solana/web3.js";
import { WhirlpoolContext } from "../context";
import { WhirlpoolAccountFetchOptions, WhirlpoolAccountFetcherInterface } from "../network/public/fetcher";
import { WhirlpoolRouter } from "../router/public";
import { Position, Whirlpool, WhirlpoolClient } from "../whirlpool-client";
export declare class WhirlpoolClientImpl implements WhirlpoolClient {
    readonly ctx: WhirlpoolContext;
    constructor(ctx: WhirlpoolContext);
    getContext(): WhirlpoolContext;
    getFetcher(): WhirlpoolAccountFetcherInterface;
    getRouter(poolAddresses: Address[]): Promise<WhirlpoolRouter>;
    getPool(poolAddress: Address, opts?: import("@orca-so/common-sdk").SimpleAccountFetchOptions): Promise<Whirlpool>;
    getPools(poolAddresses: Address[], opts?: import("@orca-so/common-sdk").SimpleAccountFetchOptions): Promise<Whirlpool[]>;
    getPosition(positionAddress: Address, opts?: import("@orca-so/common-sdk").SimpleAccountFetchOptions): Promise<Position>;
    getPositions(positionAddresses: Address[], opts?: import("@orca-so/common-sdk").SimpleAccountFetchOptions): Promise<Record<string, Position | null>>;
    createPool(whirlpoolsConfig: Address, tokenMintA: Address, tokenMintB: Address, tickSpacing: number, initialTick: number, funder: Address, opts?: import("@orca-so/common-sdk").SimpleAccountFetchOptions): Promise<{
        poolKey: PublicKey;
        tx: TransactionBuilder;
    }>;
    collectFeesAndRewardsForPositions(positionAddresses: Address[], opts?: WhirlpoolAccountFetchOptions): Promise<TransactionBuilder[]>;
    collectProtocolFeesForPools(poolAddresses: Address[]): Promise<TransactionBuilder>;
}

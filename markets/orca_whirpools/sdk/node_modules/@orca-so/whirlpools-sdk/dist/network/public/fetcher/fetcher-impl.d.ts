import { Address } from "@coral-xyz/anchor";
import { AccountFetcher, ParsableEntity } from "@orca-so/common-sdk";
import { Mint, Account as TokenAccount } from "@solana/spl-token";
import { Connection } from "@solana/web3.js";
import { WhirlpoolAccountFetchOptions, WhirlpoolAccountFetcherInterface, WhirlpoolSupportedTypes } from "..";
import { FeeTierData, PositionBundleData, PositionData, TickArrayData, WhirlpoolData, WhirlpoolsConfigData } from "../../../types/public";
/**
 * Build a default instance of {@link WhirlpoolAccountFetcherInterface} with the default {@link AccountFetcher} implementation
 * @param connection An instance of {@link Connection} to use for fetching accounts
 * @returns An instance of {@link WhirlpoolAccountFetcherInterface}
 * @category Network
 */
export declare const buildDefaultAccountFetcher: (connection: Connection) => WhirlpoolAccountFetcher;
/**
 * Fetcher and cache layer for fetching {@link WhirlpoolSupportedTypes} from the network
 * Default implementation for {@link WhirlpoolAccountFetcherInterface}
 * @category Network
 */
export declare class WhirlpoolAccountFetcher implements WhirlpoolAccountFetcherInterface {
    readonly connection: Connection;
    readonly fetcher: AccountFetcher<WhirlpoolSupportedTypes, WhirlpoolAccountFetchOptions>;
    private _accountRentExempt;
    constructor(connection: Connection, fetcher: AccountFetcher<WhirlpoolSupportedTypes, WhirlpoolAccountFetchOptions>);
    getAccountRentExempt(refresh?: boolean): Promise<number>;
    getPool(address: Address, opts?: WhirlpoolAccountFetchOptions): Promise<WhirlpoolData | null>;
    getPools(addresses: Address[], opts?: WhirlpoolAccountFetchOptions): Promise<ReadonlyMap<string, WhirlpoolData | null>>;
    getPosition(address: Address, opts?: WhirlpoolAccountFetchOptions): Promise<PositionData | null>;
    getPositions(addresses: Address[], opts?: WhirlpoolAccountFetchOptions): Promise<ReadonlyMap<string, PositionData | null>>;
    getTickArray(address: Address, opts?: WhirlpoolAccountFetchOptions): Promise<TickArrayData | null>;
    getTickArrays(addresses: Address[], opts?: WhirlpoolAccountFetchOptions): Promise<ReadonlyArray<TickArrayData | null>>;
    getFeeTier(address: Address, opts?: WhirlpoolAccountFetchOptions): Promise<FeeTierData | null>;
    getFeeTiers(addresses: Address[], opts?: WhirlpoolAccountFetchOptions): Promise<ReadonlyMap<string, FeeTierData | null>>;
    getTokenInfo(address: Address, opts?: WhirlpoolAccountFetchOptions): Promise<TokenAccount | null>;
    getTokenInfos(addresses: Address[], opts?: WhirlpoolAccountFetchOptions): Promise<ReadonlyMap<string, TokenAccount | null>>;
    getMintInfo(address: Address, opts?: WhirlpoolAccountFetchOptions): Promise<Mint | null>;
    getMintInfos(addresses: Address[], opts?: WhirlpoolAccountFetchOptions): Promise<ReadonlyMap<string, Mint | null>>;
    getConfig(address: Address, opts?: WhirlpoolAccountFetchOptions): Promise<WhirlpoolsConfigData | null>;
    getConfigs(addresses: Address[], opts?: WhirlpoolAccountFetchOptions): Promise<ReadonlyMap<string, WhirlpoolsConfigData | null>>;
    getPositionBundle(address: Address, opts?: WhirlpoolAccountFetchOptions): Promise<PositionBundleData | null>;
    getPositionBundles(addresses: Address[], opts?: WhirlpoolAccountFetchOptions): Promise<ReadonlyMap<string, PositionBundleData | null>>;
    populateCache<T extends WhirlpoolSupportedTypes>(accounts: ReadonlyMap<string, T>, parser: ParsableEntity<T>, now?: number): void;
}

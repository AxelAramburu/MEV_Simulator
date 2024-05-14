import { AnchorProvider, Program } from "@coral-xyz/anchor";
import { BuildOptions, LookupTableFetcher, TransactionBuilderOptions, Wallet, WrappedSolAccountCreateMethod } from "@orca-so/common-sdk";
import { Commitment, Connection, PublicKey, SendOptions } from "@solana/web3.js";
import { Whirlpool } from "./artifacts/whirlpool";
import { WhirlpoolAccountFetcherInterface } from "./network/public/";
/**
 * Default settings used when interacting with transactions.
 * @category Core
 */
export type WhirlpoolContextOpts = {
    userDefaultBuildOptions?: Partial<BuildOptions>;
    userDefaultSendOptions?: Partial<SendOptions>;
    userDefaultConfirmCommitment?: Commitment;
    accountResolverOptions?: AccountResolverOptions;
};
/**
 * Default settings used when resolving token accounts.
 * @category Core
 */
export type AccountResolverOptions = {
    createWrappedSolAccountMethod: WrappedSolAccountCreateMethod;
    allowPDAOwnerAddress: boolean;
};
/**
 * Context for storing environment classes and objects for usage throughout the SDK
 * @category Core
 */
export declare class WhirlpoolContext {
    readonly connection: Connection;
    readonly wallet: Wallet;
    readonly program: Program<Whirlpool>;
    readonly provider: AnchorProvider;
    readonly fetcher: WhirlpoolAccountFetcherInterface;
    readonly lookupTableFetcher: LookupTableFetcher | undefined;
    readonly opts: WhirlpoolContextOpts;
    readonly txBuilderOpts: TransactionBuilderOptions | undefined;
    readonly accountResolverOpts: AccountResolverOptions;
    static from(connection: Connection, wallet: Wallet, programId: PublicKey, fetcher?: WhirlpoolAccountFetcherInterface, lookupTableFetcher?: LookupTableFetcher, opts?: WhirlpoolContextOpts): WhirlpoolContext;
    static fromWorkspace(provider: AnchorProvider, program: Program, fetcher?: WhirlpoolAccountFetcherInterface, lookupTableFetcher?: LookupTableFetcher, opts?: WhirlpoolContextOpts): WhirlpoolContext;
    static withProvider(provider: AnchorProvider, programId: PublicKey, fetcher?: WhirlpoolAccountFetcherInterface, lookupTableFetcher?: LookupTableFetcher, opts?: WhirlpoolContextOpts): WhirlpoolContext;
    constructor(provider: AnchorProvider, wallet: Wallet, program: Program, fetcher: WhirlpoolAccountFetcherInterface, lookupTableFetcher?: LookupTableFetcher, opts?: WhirlpoolContextOpts);
}

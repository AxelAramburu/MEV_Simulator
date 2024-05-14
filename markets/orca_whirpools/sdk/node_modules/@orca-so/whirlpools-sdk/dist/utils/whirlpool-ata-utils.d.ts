import { Instruction, TransactionBuilder, WrappedSolAccountCreateMethod } from "@orca-so/common-sdk";
import { PublicKey } from "@solana/web3.js";
import { WhirlpoolContext } from "..";
import { WhirlpoolData } from "../types/public";
export declare enum TokenMintTypes {
    ALL = "ALL",
    POOL_ONLY = "POOL_ONLY",
    REWARD_ONLY = "REWARDS_ONLY"
}
export type WhirlpoolsTokenMints = {
    mintMap: PublicKey[];
    hasNativeMint: boolean;
};
/**
 * Fetch a list of affliated tokens from a list of whirlpools
 *
 * SOL tokens does not use the ATA program and therefore not handled.
 * @param whirlpoolDatas An array of whirlpoolData (from fetcher.listPools)
 * @param mintTypes The set of mints to collect from these whirlpools
 * @returns All the whirlpool, reward token mints in the given set of whirlpools
 */
export declare function getTokenMintsFromWhirlpools(whirlpoolDatas: (WhirlpoolData | null)[], mintTypes?: TokenMintTypes): WhirlpoolsTokenMints;
/**
 * Parameters to resolve ATAs for affliated tokens in a list of Whirlpools
 *
 * @category Instruction Types
 * @param mints - The list of mints to generate affliated tokens for.
 * @param accountExemption - The value from the most recent getMinimumBalanceForRentExemption().
 * @param destinationWallet - the wallet to generate ATAs against
 * @param payer - The payer address that would pay for the creation of ATA addresses
 */
export type ResolveAtaInstructionParams = {
    mints: PublicKey[];
    accountExemption: number;
    receiver?: PublicKey;
    payer?: PublicKey;
};
/**
 * An interface of mapping between tokenMint & ATA & the instruction set to initialize them.
 *
 * @category Instruction Types
 * @param ataTokenAddresses - A record between the token mint & generated ATA addresses
 * @param resolveAtaIxs - An array of instructions to initialize all uninitialized ATA token accounts for the list above.
 */
export type ResolvedATAInstructionSet = {
    ataTokenAddresses: Record<string, PublicKey>;
    resolveAtaIxs: Instruction[];
};
/**
 * Build instructions to resolve ATAs (Associated Tokens Addresses) for affliated tokens in a list of Whirlpools.
 * Affliated tokens are tokens that are part of the trade pair or reward in a Whirlpool.
 *
 * @param ctx - WhirlpoolContext object for the current environment.
 * @param params - ResolveAtaInstructionParams
 * @returns a ResolvedTokenAddressesIxSet containing the derived ATA addresses & ix set to initialize the accounts.
 */
export declare function resolveAtaForMints(ctx: WhirlpoolContext, params: ResolveAtaInstructionParams): Promise<ResolvedATAInstructionSet>;
/**
 * Add native WSOL mint handling to a transaction builder.
 */
export declare function addNativeMintHandlingIx(txBuilder: TransactionBuilder, affliatedTokenAtaMap: Record<string, PublicKey>, destinationWallet: PublicKey, accountExemption: number, createAccountMethod: WrappedSolAccountCreateMethod): void;

import { Program } from "@coral-xyz/anchor";
import { Instruction, PDA } from "@orca-so/common-sdk";
import { Keypair, PublicKey } from "@solana/web3.js";
import { Whirlpool } from "../artifacts/whirlpool";
/**
 * Parameters to initialize a PositionBundle account.
 *
 * @category Instruction Types
 * @param owner - PublicKey for the wallet that will host the minted position bundle token.
 * @param positionBundlePda - PDA for the derived position bundle address.
 * @param positionBundleMintKeypair - Keypair for the mint for the position bundle token.
 * @param positionBundleTokenAccount - The associated token address for the position bundle token in the owners wallet.
 * @param funder - The account that would fund the creation of this account
 */
export type InitializePositionBundleParams = {
    owner: PublicKey;
    positionBundlePda: PDA;
    positionBundleMintKeypair: Keypair;
    positionBundleTokenAccount: PublicKey;
    funder: PublicKey;
};
/**
 * Initializes a PositionBundle account.
 *
 * @category Instructions
 * @param program - program object containing services required to generate the instruction
 * @param params - InitializePositionBundleParams object
 * @returns - Instruction to perform the action.
 */
export declare function initializePositionBundleIx(program: Program<Whirlpool>, params: InitializePositionBundleParams): Instruction;
/**
 * Initializes a PositionBundle account.
 * Additional Metaplex metadata is appended to identify the token.
 *
 * @category Instructions
 * @param program - program object containing services required to generate the instruction
 * @param params - InitializePositionBundleParams object
 * @returns - Instruction to perform the action.
 */
export declare function initializePositionBundleWithMetadataIx(program: Program<Whirlpool>, params: InitializePositionBundleParams & {
    positionBundleMetadataPda: PDA;
}): Instruction;

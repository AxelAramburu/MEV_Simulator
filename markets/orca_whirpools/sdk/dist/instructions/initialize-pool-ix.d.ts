/// <reference types="bn.js" />
import { BN, Program } from "@coral-xyz/anchor";
import { Instruction, PDA } from "@orca-so/common-sdk";
import { Keypair, PublicKey } from "@solana/web3.js";
import { Whirlpool } from "../artifacts/whirlpool";
/**
 * Parameters to initialize a Whirlpool account.
 *
 * @category Instruction Types
 * @param initSqrtPrice - The desired initial sqrt-price for this pool
 * @param whirlpoolsConfig - The public key for the WhirlpoolsConfig this pool is initialized in
 * @param whirlpoolPda - PDA for the whirlpool account that would be initialized
 * @param tokenMintA - Mint public key for token A
 * @param tokenMintB - Mint public key for token B
 * @param tokenVaultAKeypair - Keypair of the token A vault for this pool
 * @param tokenVaultBKeypair - Keypair of the token B vault for this pool
 * @param feeTierKey - PublicKey of the fee-tier account that this pool would use for the fee-rate
 * @param tickSpacing - The desired tick spacing for this pool.
 * @param funder - The account that would fund the creation of this account
 */
export type InitPoolParams = {
    initSqrtPrice: BN;
    whirlpoolsConfig: PublicKey;
    whirlpoolPda: PDA;
    tokenMintA: PublicKey;
    tokenMintB: PublicKey;
    tokenVaultAKeypair: Keypair;
    tokenVaultBKeypair: Keypair;
    feeTierKey: PublicKey;
    tickSpacing: number;
    funder: PublicKey;
};
/**
 * Initializes a tick_array account to represent a tick-range in a Whirlpool.
 *
 * Special Errors
 * `InvalidTokenMintOrder` - The order of mints have to be ordered by
 * `SqrtPriceOutOfBounds` - provided initial_sqrt_price is not between 2^-64 to 2^64
 *
 * @category Instructions
 * @param context - Context object containing services required to generate the instruction
 * @param params - InitPoolParams object
 * @returns - Instruction to perform the action.
 */
export declare function initializePoolIx(program: Program<Whirlpool>, params: InitPoolParams): Instruction;

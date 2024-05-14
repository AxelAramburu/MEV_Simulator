"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initializePoolIx = void 0;
const spl_token_1 = require("@solana/spl-token");
const web3_js_1 = require("@solana/web3.js");
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
function initializePoolIx(program, params) {
    const { initSqrtPrice, tokenMintA, tokenMintB, whirlpoolsConfig, whirlpoolPda, feeTierKey, tokenVaultAKeypair, tokenVaultBKeypair, tickSpacing, funder, } = params;
    const whirlpoolBumps = {
        whirlpoolBump: whirlpoolPda.bump,
    };
    const ix = program.instruction.initializePool(whirlpoolBumps, tickSpacing, initSqrtPrice, {
        accounts: {
            whirlpoolsConfig,
            tokenMintA,
            tokenMintB,
            funder,
            whirlpool: whirlpoolPda.publicKey,
            tokenVaultA: tokenVaultAKeypair.publicKey,
            tokenVaultB: tokenVaultBKeypair.publicKey,
            feeTier: feeTierKey,
            tokenProgram: spl_token_1.TOKEN_PROGRAM_ID,
            systemProgram: web3_js_1.SystemProgram.programId,
            rent: web3_js_1.SYSVAR_RENT_PUBKEY,
        },
    });
    return {
        instructions: [ix],
        cleanupInstructions: [],
        signers: [tokenVaultAKeypair, tokenVaultBKeypair],
    };
}
exports.initializePoolIx = initializePoolIx;

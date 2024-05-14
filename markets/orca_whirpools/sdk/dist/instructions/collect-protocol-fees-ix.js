"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.collectProtocolFeesIx = void 0;
const spl_token_1 = require("@solana/spl-token");
/**
 * Collect protocol fees accrued in this Whirlpool.
 *
 * @category Instructions
 * @param context - Context object containing services required to generate the instruction
 * @param params - CollectProtocolFeesParams object
 * @returns - Instruction to perform the action.
 */
function collectProtocolFeesIx(program, params) {
    const { whirlpoolsConfig, whirlpool, collectProtocolFeesAuthority, tokenVaultA, tokenVaultB, tokenOwnerAccountA: tokenDestinationA, tokenOwnerAccountB: tokenDestinationB, } = params;
    const ix = program.instruction.collectProtocolFees({
        accounts: {
            whirlpoolsConfig,
            whirlpool,
            collectProtocolFeesAuthority,
            tokenVaultA,
            tokenVaultB,
            tokenDestinationA,
            tokenDestinationB,
            tokenProgram: spl_token_1.TOKEN_PROGRAM_ID,
        },
    });
    return {
        instructions: [ix],
        cleanupInstructions: [],
        signers: [],
    };
}
exports.collectProtocolFeesIx = collectProtocolFeesIx;

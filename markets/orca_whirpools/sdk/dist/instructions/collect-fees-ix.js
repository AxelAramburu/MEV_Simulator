"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.collectFeesIx = void 0;
const spl_token_1 = require("@solana/spl-token");
/**
 * Collect fees accrued for this position.
 * Call updateFeesAndRewards before this to update the position to the newest accrued values.
 *
 * @category Instructions
 * @param context - Context object containing services required to generate the instruction
 * @param params - CollectFeesParams object
 * @returns - Instruction to perform the action.
 */
function collectFeesIx(program, params) {
    const { whirlpool, positionAuthority, position, positionTokenAccount, tokenOwnerAccountA, tokenOwnerAccountB, tokenVaultA, tokenVaultB, } = params;
    const ix = program.instruction.collectFees({
        accounts: {
            whirlpool,
            positionAuthority,
            position,
            positionTokenAccount,
            tokenOwnerAccountA,
            tokenOwnerAccountB,
            tokenVaultA,
            tokenVaultB,
            tokenProgram: spl_token_1.TOKEN_PROGRAM_ID,
        },
    });
    return {
        instructions: [ix],
        cleanupInstructions: [],
        signers: [],
    };
}
exports.collectFeesIx = collectFeesIx;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deletePositionBundleIx = void 0;
const spl_token_1 = require("@solana/spl-token");
/**
 * Deletes a PositionBundle account.
 *
 * #### Special Errors
 * `PositionBundleNotDeletable` - The provided position bundle has open positions.
 *
 * @category Instructions
 * @param program - program object containing services required to generate the instruction
 * @param params - DeletePositionBundleParams object
 * @returns - Instruction to perform the action.
 */
function deletePositionBundleIx(program, params) {
    const { owner, positionBundle, positionBundleMint, positionBundleTokenAccount, receiver } = params;
    const ix = program.instruction.deletePositionBundle({
        accounts: {
            positionBundle: positionBundle,
            positionBundleMint: positionBundleMint,
            positionBundleTokenAccount,
            positionBundleOwner: owner,
            receiver,
            tokenProgram: spl_token_1.TOKEN_PROGRAM_ID,
        },
    });
    return {
        instructions: [ix],
        cleanupInstructions: [],
        signers: [],
    };
}
exports.deletePositionBundleIx = deletePositionBundleIx;

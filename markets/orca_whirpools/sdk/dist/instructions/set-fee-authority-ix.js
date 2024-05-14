"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setFeeAuthorityIx = void 0;
/**
 * Sets the fee authority for a WhirlpoolsConfig.
 * The fee authority can set the fee & protocol fee rate for individual pools or set the default fee rate for newly minted pools.
 * Only the current fee authority has permission to invoke this instruction.
 *
 * @category Instructions
 * @param context - Context object containing services required to generate the instruction
 * @param params - SetFeeAuthorityParams object
 * @returns - Instruction to perform the action.
 */
function setFeeAuthorityIx(program, params) {
    const { whirlpoolsConfig, feeAuthority, newFeeAuthority } = params;
    const ix = program.instruction.setFeeAuthority({
        accounts: {
            whirlpoolsConfig,
            feeAuthority,
            newFeeAuthority,
        },
    });
    return {
        instructions: [ix],
        cleanupInstructions: [],
        signers: [],
    };
}
exports.setFeeAuthorityIx = setFeeAuthorityIx;

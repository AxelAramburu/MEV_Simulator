"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setCollectProtocolFeesAuthorityIx = void 0;
/**
 * Sets the fee authority to collect protocol fees for a WhirlpoolsConfig.
 * Only the current collect protocol fee authority has permission to invoke this instruction.
 *
 * @category Instructions
 * @param context - Context object containing services required to generate the instruction
 * @param params - SetCollectProtocolFeesAuthorityParams object
 * @returns - Instruction to perform the action.
 */
function setCollectProtocolFeesAuthorityIx(program, params) {
    const { whirlpoolsConfig, collectProtocolFeesAuthority, newCollectProtocolFeesAuthority } = params;
    const ix = program.instruction.setCollectProtocolFeesAuthority({
        accounts: {
            whirlpoolsConfig,
            collectProtocolFeesAuthority,
            newCollectProtocolFeesAuthority,
        },
    });
    return {
        instructions: [ix],
        cleanupInstructions: [],
        signers: [],
    };
}
exports.setCollectProtocolFeesAuthorityIx = setCollectProtocolFeesAuthorityIx;

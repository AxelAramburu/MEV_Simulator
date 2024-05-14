"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setRewardEmissionsSuperAuthorityIx = void 0;
/**
 * Set the whirlpool reward super authority for a WhirlpoolsConfig
 * Only the current reward super authority has permission to invoke this instruction.
 * This instruction will not change the authority on any `WhirlpoolRewardInfo` whirlpool rewards.
 *
 * @category Instructions
 * @param context - Context object containing services required to generate the instruction
 * @param params - SetRewardEmissionsSuperAuthorityParams object
 * @returns - Instruction to perform the action.
 */
function setRewardEmissionsSuperAuthorityIx(program, params) {
    const { whirlpoolsConfig, rewardEmissionsSuperAuthority, newRewardEmissionsSuperAuthority } = params;
    const ix = program.instruction.setRewardEmissionsSuperAuthority({
        accounts: {
            whirlpoolsConfig,
            rewardEmissionsSuperAuthority: rewardEmissionsSuperAuthority,
            newRewardEmissionsSuperAuthority,
        },
    });
    return {
        instructions: [ix],
        cleanupInstructions: [],
        signers: [],
    };
}
exports.setRewardEmissionsSuperAuthorityIx = setRewardEmissionsSuperAuthorityIx;

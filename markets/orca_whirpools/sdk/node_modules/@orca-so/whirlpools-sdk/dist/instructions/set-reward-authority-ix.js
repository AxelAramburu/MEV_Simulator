"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setRewardAuthorityIx = void 0;
/**
 * Set the whirlpool reward authority at the provided `reward_index`.
 * Only the current reward authority for this reward index has permission to invoke this instruction.
 *
 * #### Special Errors
 * - `InvalidRewardIndex` - If the provided reward index doesn't match the lowest uninitialized index in this pool,
 *                          or exceeds NUM_REWARDS.
 *
 * @category Instructions
 * @param context - Context object containing services required to generate the instruction
 * @param params - SetRewardAuthorityParams object
 * @returns - Instruction to perform the action.
 */
function setRewardAuthorityIx(program, params) {
    const { whirlpool, rewardAuthority, newRewardAuthority, rewardIndex } = params;
    const ix = program.instruction.setRewardAuthority(rewardIndex, {
        accounts: {
            whirlpool,
            rewardAuthority,
            newRewardAuthority,
        },
    });
    return {
        instructions: [ix],
        cleanupInstructions: [],
        signers: [],
    };
}
exports.setRewardAuthorityIx = setRewardAuthorityIx;

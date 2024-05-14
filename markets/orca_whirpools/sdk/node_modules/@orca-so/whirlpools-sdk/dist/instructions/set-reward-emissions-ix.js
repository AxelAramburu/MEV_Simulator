"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setRewardEmissionsIx = void 0;
/**
 * Set the reward emissions for a reward in a Whirlpool.
 *
 * #### Special Errors
 * - `RewardVaultAmountInsufficient` - The amount of rewards in the reward vault cannot emit more than a day of desired emissions.
 * - `InvalidTimestamp` - Provided timestamp is not in order with the previous timestamp.
 * - `InvalidRewardIndex` - If the provided reward index doesn't match the lowest uninitialized index in this pool,
 *                          or exceeds NUM_REWARDS.
 *
 * @category Instructions
 * @param context - Context object containing services required to generate the instruction
 * @param params - SetRewardEmissionsParams object
 * @returns - Instruction to perform the action.
 */
function setRewardEmissionsIx(program, params) {
    const { rewardAuthority, whirlpool, rewardIndex, rewardVaultKey: rewardVault, emissionsPerSecondX64, } = params;
    const ix = program.instruction.setRewardEmissions(rewardIndex, emissionsPerSecondX64, {
        accounts: {
            rewardAuthority,
            whirlpool,
            rewardVault,
        },
    });
    return {
        instructions: [ix],
        cleanupInstructions: [],
        signers: [],
    };
}
exports.setRewardEmissionsIx = setRewardEmissionsIx;

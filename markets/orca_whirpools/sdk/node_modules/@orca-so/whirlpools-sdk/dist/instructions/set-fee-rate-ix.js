"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setFeeRateIx = void 0;
/**
 * Sets the fee rate for a Whirlpool.
 * Only the current fee authority has permission to invoke this instruction.
 *
 * #### Special Errors
 * - `FeeRateMaxExceeded` - If the provided fee_rate exceeds MAX_FEE_RATE.
 *
 * @category Instructions
 * @param context - Context object containing services required to generate the instruction
 * @param params - SetFeeRateParams object
 * @returns - Instruction to perform the action.
 */
function setFeeRateIx(program, params) {
    const { whirlpoolsConfig, whirlpool, feeAuthority, feeRate } = params;
    const ix = program.instruction.setFeeRate(feeRate, {
        accounts: {
            whirlpoolsConfig,
            whirlpool,
            feeAuthority,
        },
    });
    return {
        instructions: [ix],
        cleanupInstructions: [],
        signers: [],
    };
}
exports.setFeeRateIx = setFeeRateIx;

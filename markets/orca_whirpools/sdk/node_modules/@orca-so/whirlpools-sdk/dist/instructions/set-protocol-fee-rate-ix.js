"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setProtocolFeeRateIx = void 0;
/**
 * Sets the protocol fee rate for a Whirlpool.
 * Only the current fee authority has permission to invoke this instruction.
 *
 * #### Special Errors
 * - `ProtocolFeeRateMaxExceeded` - If the provided default_protocol_fee_rate exceeds MAX_PROTOCOL_FEE_RATE.
 *
 * @category Instructions
 * @param context - Context object containing services required to generate the instruction
 * @param params - SetFeeRateParams object
 * @returns - Instruction to perform the action.
 */
function setProtocolFeeRateIx(program, params) {
    const { whirlpoolsConfig, whirlpool, feeAuthority, protocolFeeRate } = params;
    const ix = program.instruction.setProtocolFeeRate(protocolFeeRate, {
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
exports.setProtocolFeeRateIx = setProtocolFeeRateIx;

"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initTickArrayIx = void 0;
const anchor = __importStar(require("@coral-xyz/anchor"));
/**
 * Initializes a TickArray account.
 *
 * #### Special Errors
 *  `InvalidStartTick` - if the provided start tick is out of bounds or is not a multiple of TICK_ARRAY_SIZE * tick spacing.
 *
 * @category Instructions
 * @param context - Context object containing services required to generate the instruction
 * @param params - InitTickArrayParams object
 * @returns - Instruction to perform the action.
 */
function initTickArrayIx(program, params) {
    const { whirlpool, funder, tickArrayPda } = params;
    const ix = program.instruction.initializeTickArray(params.startTick, {
        accounts: {
            whirlpool,
            funder,
            tickArray: tickArrayPda.publicKey,
            systemProgram: anchor.web3.SystemProgram.programId,
        },
    });
    return {
        instructions: [ix],
        cleanupInstructions: [],
        signers: [],
    };
}
exports.initTickArrayIx = initTickArrayIx;

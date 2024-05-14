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
exports.initializeRewardIx = void 0;
const anchor = __importStar(require("@coral-xyz/anchor"));
const spl_token_1 = require("@solana/spl-token");
const web3_js_1 = require("@solana/web3.js");
/**
 * Initialize reward for a Whirlpool. A pool can only support up to a set number of rewards.
 * The initial emissionsPerSecond is set to 0.
 *
 * #### Special Errors
 * - `InvalidRewardIndex` - If the provided reward index doesn't match the lowest uninitialized index in this pool,
 *                          or exceeds NUM_REWARDS, or all reward slots for this pool has been initialized.
 *
 * @category Instructions
 * @param context - Context object containing services required to generate the instruction
 * @param params - InitializeRewardParams object
 * @returns - Instruction to perform the action.
 */
function initializeRewardIx(program, params) {
    const { rewardAuthority, funder, whirlpool, rewardMint, rewardVaultKeypair, rewardIndex } = params;
    const ix = program.instruction.initializeReward(rewardIndex, {
        accounts: {
            rewardAuthority,
            funder,
            whirlpool,
            rewardMint,
            rewardVault: rewardVaultKeypair.publicKey,
            tokenProgram: spl_token_1.TOKEN_PROGRAM_ID,
            systemProgram: web3_js_1.SystemProgram.programId,
            rent: anchor.web3.SYSVAR_RENT_PUBKEY,
        },
    });
    return {
        instructions: [ix],
        cleanupInstructions: [],
        signers: [rewardVaultKeypair],
    };
}
exports.initializeRewardIx = initializeRewardIx;

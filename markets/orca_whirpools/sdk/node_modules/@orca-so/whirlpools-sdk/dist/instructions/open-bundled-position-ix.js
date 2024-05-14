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
exports.openBundledPositionIx = void 0;
const anchor = __importStar(require("@coral-xyz/anchor"));
const web3_js_1 = require("@solana/web3.js");
/**
 * Open a bundled position in a Whirlpool.
 * No new tokens are issued because the owner of the position bundle becomes the owner of the position.
 * The position will start off with 0 liquidity.
 *
 * #### Special Errors
 * `InvalidBundleIndex` - If the provided bundle index is out of bounds.
 * `InvalidTickIndex` - If a provided tick is out of bounds, out of order or not a multiple of the tick-spacing in this pool.
 *
 * @category Instructions
 * @param program - program object containing services required to generate the instruction
 * @param params - OpenBundledPositionParams object
 * @returns - Instruction to perform the action.
 */
function openBundledPositionIx(program, params) {
    const { whirlpool, bundledPositionPda, positionBundle, positionBundleTokenAccount, positionBundleAuthority, bundleIndex, tickLowerIndex, tickUpperIndex, funder, } = params;
    const ix = program.instruction.openBundledPosition(bundleIndex, tickLowerIndex, tickUpperIndex, {
        accounts: {
            bundledPosition: bundledPositionPda.publicKey,
            positionBundle,
            positionBundleTokenAccount,
            positionBundleAuthority,
            whirlpool,
            funder,
            systemProgram: web3_js_1.SystemProgram.programId,
            rent: anchor.web3.SYSVAR_RENT_PUBKEY,
        },
    });
    return {
        instructions: [ix],
        cleanupInstructions: [],
        signers: [],
    };
}
exports.openBundledPositionIx = openBundledPositionIx;

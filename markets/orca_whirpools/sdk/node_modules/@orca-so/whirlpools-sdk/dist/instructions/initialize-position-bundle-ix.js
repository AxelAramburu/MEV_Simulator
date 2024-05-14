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
exports.initializePositionBundleWithMetadataIx = exports.initializePositionBundleIx = void 0;
const anchor = __importStar(require("@coral-xyz/anchor"));
const spl_token_1 = require("@solana/spl-token");
const web3_js_1 = require("@solana/web3.js");
const __1 = require("..");
/**
 * Initializes a PositionBundle account.
 *
 * @category Instructions
 * @param program - program object containing services required to generate the instruction
 * @param params - InitializePositionBundleParams object
 * @returns - Instruction to perform the action.
 */
function initializePositionBundleIx(program, params) {
    const { owner, positionBundlePda, positionBundleMintKeypair, positionBundleTokenAccount, funder, } = params;
    const ix = program.instruction.initializePositionBundle({
        accounts: {
            positionBundle: positionBundlePda.publicKey,
            positionBundleMint: positionBundleMintKeypair.publicKey,
            positionBundleTokenAccount,
            positionBundleOwner: owner,
            funder,
            associatedTokenProgram: spl_token_1.ASSOCIATED_TOKEN_PROGRAM_ID,
            tokenProgram: spl_token_1.TOKEN_PROGRAM_ID,
            systemProgram: web3_js_1.SystemProgram.programId,
            rent: anchor.web3.SYSVAR_RENT_PUBKEY,
        },
    });
    return {
        instructions: [ix],
        cleanupInstructions: [],
        signers: [positionBundleMintKeypair],
    };
}
exports.initializePositionBundleIx = initializePositionBundleIx;
/**
 * Initializes a PositionBundle account.
 * Additional Metaplex metadata is appended to identify the token.
 *
 * @category Instructions
 * @param program - program object containing services required to generate the instruction
 * @param params - InitializePositionBundleParams object
 * @returns - Instruction to perform the action.
 */
function initializePositionBundleWithMetadataIx(program, params) {
    const { owner, positionBundlePda, positionBundleMintKeypair, positionBundleTokenAccount, positionBundleMetadataPda, funder, } = params;
    const ix = program.instruction.initializePositionBundleWithMetadata({
        accounts: {
            positionBundle: positionBundlePda.publicKey,
            positionBundleMint: positionBundleMintKeypair.publicKey,
            positionBundleMetadata: positionBundleMetadataPda.publicKey,
            positionBundleTokenAccount,
            positionBundleOwner: owner,
            funder,
            associatedTokenProgram: spl_token_1.ASSOCIATED_TOKEN_PROGRAM_ID,
            tokenProgram: spl_token_1.TOKEN_PROGRAM_ID,
            systemProgram: web3_js_1.SystemProgram.programId,
            rent: anchor.web3.SYSVAR_RENT_PUBKEY,
            metadataProgram: __1.METADATA_PROGRAM_ADDRESS,
            metadataUpdateAuth: __1.WHIRLPOOL_NFT_UPDATE_AUTH,
        },
    });
    return {
        instructions: [ix],
        cleanupInstructions: [],
        signers: [positionBundleMintKeypair],
    };
}
exports.initializePositionBundleWithMetadataIx = initializePositionBundleWithMetadataIx;

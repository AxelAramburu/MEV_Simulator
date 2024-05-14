"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.openPositionWithMetadataIx = exports.openPositionIx = void 0;
const __1 = require("..");
const instructions_util_1 = require("../utils/instructions-util");
/**
 * Open a position in a Whirlpool. A unique token will be minted to represent the position in the users wallet.
 * The position will start off with 0 liquidity.
 *
 * #### Special Errors
 * `InvalidTickIndex` - If a provided tick is out of bounds, out of order or not a multiple of the tick-spacing in this pool.
 *
 * @category Instructions
 * @param context - Context object containing services required to generate the instruction
 * @param params - OpenPositionParams object
 * @returns - Instruction to perform the action.
 */
function openPositionIx(program, params) {
    const { positionPda, tickLowerIndex, tickUpperIndex } = params;
    const bumps = {
        positionBump: positionPda.bump,
    };
    const ix = program.instruction.openPosition(bumps, tickLowerIndex, tickUpperIndex, {
        accounts: (0, instructions_util_1.openPositionAccounts)(params),
    });
    // TODO: Require Keypair and auto sign this ix
    return {
        instructions: [ix],
        cleanupInstructions: [],
        signers: [],
    };
}
exports.openPositionIx = openPositionIx;
/**
 * Open a position in a Whirlpool. A unique token will be minted to represent the position
 * in the users wallet. Additional Metaplex metadata is appended to identify the token.
 * The position will start off with 0 liquidity.
 *
 * #### Special Errors
 * `InvalidTickIndex` - If a provided tick is out of bounds, out of order or not a multiple of the tick-spacing in this pool.
 *
 * @category Instructions
 * @param context - Context object containing services required to generate the instruction
 * @param params - OpenPositionParams object and a derived PDA that hosts the position's metadata.
 * @returns - Instruction to perform the action.
 */
function openPositionWithMetadataIx(program, params) {
    const { positionPda, metadataPda, tickLowerIndex, tickUpperIndex } = params;
    const bumps = {
        positionBump: positionPda.bump,
        metadataBump: metadataPda.bump,
    };
    const ix = program.instruction.openPositionWithMetadata(bumps, tickLowerIndex, tickUpperIndex, {
        accounts: {
            ...(0, instructions_util_1.openPositionAccounts)(params),
            positionMetadataAccount: metadataPda.publicKey,
            metadataProgram: __1.METADATA_PROGRAM_ADDRESS,
            metadataUpdateAuth: __1.WHIRLPOOL_NFT_UPDATE_AUTH,
        },
    });
    // TODO: Require Keypair and auto sign this ix
    return {
        instructions: [ix],
        cleanupInstructions: [],
        signers: [],
    };
}
exports.openPositionWithMetadataIx = openPositionWithMetadataIx;

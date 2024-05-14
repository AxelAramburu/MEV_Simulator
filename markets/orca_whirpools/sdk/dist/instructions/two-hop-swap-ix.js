"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.twoHopSwapIx = void 0;
const spl_token_1 = require("@solana/spl-token");
/**
 * Perform a two-hop swap in this Whirlpool
 *
 * #### Special Errors
 * - `ZeroTradableAmount` - User provided parameter `amount` is 0.
 * - `InvalidSqrtPriceLimitDirection` - User provided parameter `sqrt_price_limit` does not match the direction of the trade.
 * - `SqrtPriceOutOfBounds` - User provided parameter `sqrt_price_limit` is over Whirlppool's max/min bounds for sqrt-price.
 * - `InvalidTickArraySequence` - User provided tick-arrays are not in sequential order required to proceed in this trade direction.
 * - `TickArraySequenceInvalidIndex` - The swap loop attempted to access an invalid array index during the query of the next initialized tick.
 * - `TickArrayIndexOutofBounds` - The swap loop attempted to access an invalid array index during tick crossing.
 * - `LiquidityOverflow` - Liquidity value overflowed 128bits during tick crossing.
 * - `InvalidTickSpacing` - The swap pool was initialized with tick-spacing of 0.
 * - `InvalidIntermediaryMint` - Error if the intermediary mint between hop one and two do not equal.
 * - `DuplicateTwoHopPool` - Error if whirlpool one & two are the same pool.
 *
 * ### Parameters
 * @category Instructions
 * @param context - Context object containing services required to generate the instruction
 * @param params - {@link TwoHopSwapParams} object
 * @returns - Instruction to perform the action.
 */
function twoHopSwapIx(program, params) {
    const { amount, otherAmountThreshold, amountSpecifiedIsInput, aToBOne, aToBTwo, sqrtPriceLimitOne, sqrtPriceLimitTwo, whirlpoolOne, whirlpoolTwo, tokenAuthority, tokenOwnerAccountOneA, tokenVaultOneA, tokenOwnerAccountOneB, tokenVaultOneB, tokenOwnerAccountTwoA, tokenVaultTwoA, tokenOwnerAccountTwoB, tokenVaultTwoB, tickArrayOne0, tickArrayOne1, tickArrayOne2, tickArrayTwo0, tickArrayTwo1, tickArrayTwo2, oracleOne, oracleTwo, } = params;
    const ix = program.instruction.twoHopSwap(amount, otherAmountThreshold, amountSpecifiedIsInput, aToBOne, aToBTwo, sqrtPriceLimitOne, sqrtPriceLimitTwo, {
        accounts: {
            tokenProgram: spl_token_1.TOKEN_PROGRAM_ID,
            tokenAuthority,
            whirlpoolOne,
            whirlpoolTwo,
            tokenOwnerAccountOneA,
            tokenVaultOneA,
            tokenOwnerAccountOneB,
            tokenVaultOneB,
            tokenOwnerAccountTwoA,
            tokenVaultTwoA,
            tokenOwnerAccountTwoB,
            tokenVaultTwoB,
            tickArrayOne0,
            tickArrayOne1,
            tickArrayOne2,
            tickArrayTwo0,
            tickArrayTwo1,
            tickArrayTwo2,
            oracleOne,
            oracleTwo,
        },
    });
    return {
        instructions: [ix],
        cleanupInstructions: [],
        signers: [],
    };
}
exports.twoHopSwapIx = twoHopSwapIx;

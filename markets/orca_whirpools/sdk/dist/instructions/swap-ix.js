"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.swapIx = void 0;
const spl_token_1 = require("@solana/spl-token");
/**
 * Perform a swap in this Whirlpool
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
 *
 * ### Parameters
 * @category Instructions
 * @param context - Context object containing services required to generate the instruction
 * @param params - {@link SwapParams}
 * @returns - Instruction to perform the action.
 */
function swapIx(program, params) {
    const { amount, otherAmountThreshold, sqrtPriceLimit, amountSpecifiedIsInput, aToB, whirlpool, tokenAuthority, tokenOwnerAccountA, tokenVaultA, tokenOwnerAccountB, tokenVaultB, tickArray0, tickArray1, tickArray2, oracle, } = params;
    const ix = program.instruction.swap(amount, otherAmountThreshold, sqrtPriceLimit, amountSpecifiedIsInput, aToB, {
        accounts: {
            tokenProgram: spl_token_1.TOKEN_PROGRAM_ID,
            tokenAuthority: tokenAuthority,
            whirlpool,
            tokenOwnerAccountA,
            tokenVaultA,
            tokenOwnerAccountB,
            tokenVaultB,
            tickArray0,
            tickArray1,
            tickArray2,
            oracle,
        },
    });
    return {
        instructions: [ix],
        cleanupInstructions: [],
        signers: [],
    };
}
exports.swapIx = swapIx;

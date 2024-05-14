"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTickArrayDataForPosition = void 0;
const public_1 = require("../public");
async function getTickArrayDataForPosition(ctx, position, whirlpool, opts) {
    const lowerTickArrayKey = public_1.PDAUtil.getTickArrayFromTickIndex(position.tickLowerIndex, whirlpool.tickSpacing, position.whirlpool, ctx.program.programId).publicKey;
    const upperTickArrayKey = public_1.PDAUtil.getTickArrayFromTickIndex(position.tickUpperIndex, whirlpool.tickSpacing, position.whirlpool, ctx.program.programId).publicKey;
    return await ctx.fetcher.getTickArrays([lowerTickArrayKey, upperTickArrayKey], opts);
}
exports.getTickArrayDataForPosition = getTickArrayDataForPosition;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isNativeMint = void 0;
const spl_token_1 = require("@solana/spl-token");
function isNativeMint(mint) {
    return mint.equals(spl_token_1.NATIVE_MINT);
}
exports.isNativeMint = isNativeMint;

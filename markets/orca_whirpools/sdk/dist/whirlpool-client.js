"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildWhirlpoolClient = void 0;
const whirlpool_client_impl_1 = require("./impl/whirlpool-client-impl");
/**
 * Construct a WhirlpoolClient instance to help interact with Whirlpools accounts with.
 *
 * @category WhirlpoolClient
 * @param ctx - WhirlpoolContext object
 * @returns a WhirlpoolClient instance to help with interacting with Whirlpools accounts.
 */
function buildWhirlpoolClient(ctx) {
    return new whirlpool_client_impl_1.WhirlpoolClientImpl(ctx);
}
exports.buildWhirlpoolClient = buildWhirlpoolClient;

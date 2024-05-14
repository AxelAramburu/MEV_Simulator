"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toTx = void 0;
const common_sdk_1 = require("@orca-so/common-sdk");
function toTx(ctx, ix) {
    return new common_sdk_1.TransactionBuilder(ctx.provider.connection, ctx.provider.wallet, ctx.txBuilderOpts).addInstruction(ix);
}
exports.toTx = toTx;

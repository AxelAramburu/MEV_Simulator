"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.contextOptionsToBuilderOptions = exports.checkMergedTransactionSizeIsValid = exports.filterNullObjects = exports.convertListToMap = void 0;
const common_sdk_1 = require("@orca-so/common-sdk");
function convertListToMap(fetchedData, addresses) {
    const result = {};
    fetchedData.forEach((data, index) => {
        if (data) {
            const addr = addresses[index];
            result[addr] = data;
        }
    });
    return result;
}
exports.convertListToMap = convertListToMap;
// Filter out null objects in the first array and remove the corresponding objects in the second array
function filterNullObjects(firstArray, secondArray) {
    const filteredFirstArray = [];
    const filteredSecondArray = [];
    firstArray.forEach((item, idx) => {
        if (item !== null) {
            filteredFirstArray.push(item);
            filteredSecondArray.push(secondArray[idx]);
        }
    });
    return [filteredFirstArray, filteredSecondArray];
}
exports.filterNullObjects = filterNullObjects;
async function checkMergedTransactionSizeIsValid(ctx, builders, latestBlockhash) {
    const merged = new common_sdk_1.TransactionBuilder(ctx.connection, ctx.wallet, ctx.txBuilderOpts);
    builders.forEach((builder) => merged.addInstruction(builder.compressIx(true)));
    try {
        const size = await merged.txnSize({
            latestBlockhash,
        });
        return true;
    }
    catch (e) {
        return false;
    }
}
exports.checkMergedTransactionSizeIsValid = checkMergedTransactionSizeIsValid;
function contextOptionsToBuilderOptions(opts) {
    return {
        defaultBuildOption: {
            ...common_sdk_1.defaultTransactionBuilderOptions.defaultBuildOption,
            ...opts.userDefaultBuildOptions,
        },
        defaultSendOption: {
            ...common_sdk_1.defaultTransactionBuilderOptions.defaultSendOption,
            ...opts.userDefaultSendOptions,
        },
        defaultConfirmationCommitment: opts.userDefaultConfirmCommitment ??
            common_sdk_1.defaultTransactionBuilderOptions.defaultConfirmationCommitment,
    };
}
exports.contextOptionsToBuilderOptions = contextOptionsToBuilderOptions;

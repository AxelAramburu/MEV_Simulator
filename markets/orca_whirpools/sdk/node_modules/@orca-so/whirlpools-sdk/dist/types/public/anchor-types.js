"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WHIRLPOOL_ACCOUNT_SIZE = exports.getAccountSize = exports.WHIRLPOOL_CODER = exports.WHIRLPOOL_IDL = exports.AccountName = void 0;
const anchor_1 = require("@coral-xyz/anchor");
const whirlpool_json_1 = __importDefault(require("../../artifacts/whirlpool.json"));
/**
 * This file contains the types that has the same structure as the types anchor functions returns.
 * These types are hard-casted by the client function.
 *
 * This file must be manually updated every time the idl updates as accounts will
 * be hard-casted to fit the type.
 */
/**
 * Supported parasable account names from the Whirlpool contract.
 * @category Network
 */
var AccountName;
(function (AccountName) {
    AccountName["WhirlpoolsConfig"] = "WhirlpoolsConfig";
    AccountName["Position"] = "Position";
    AccountName["TickArray"] = "TickArray";
    AccountName["Whirlpool"] = "Whirlpool";
    AccountName["FeeTier"] = "FeeTier";
    AccountName["PositionBundle"] = "PositionBundle";
})(AccountName || (exports.AccountName = AccountName = {}));
exports.WHIRLPOOL_IDL = whirlpool_json_1.default;
/**
 * The Anchor coder for the Whirlpool program.
 * @category Solana Accounts
 */
exports.WHIRLPOOL_CODER = new anchor_1.BorshAccountsCoder(exports.WHIRLPOOL_IDL);
/**
 * Get the size of an account owned by the Whirlpool program in bytes.
 * @param accountName Whirlpool account name
 * @returns Size in bytes of the account
 */
function getAccountSize(accountName) {
    const size = exports.WHIRLPOOL_CODER.size(exports.WHIRLPOOL_IDL.accounts.find((account) => account.name === accountName));
    return size + RESERVED_BYTES[accountName];
}
exports.getAccountSize = getAccountSize;
/**
 * Reserved bytes for each account used for calculating the account size.
 */
const RESERVED_BYTES = {
    [AccountName.WhirlpoolsConfig]: 2,
    [AccountName.Position]: 0,
    [AccountName.TickArray]: 0,
    [AccountName.Whirlpool]: 0,
    [AccountName.FeeTier]: 0,
    [AccountName.PositionBundle]: 64,
};
/**
 * Size of the Whirlpool account in bytes.
 * @deprecated Please use {@link getAccountSize} instead.
 * @category Solana Accounts
 */
exports.WHIRLPOOL_ACCOUNT_SIZE = getAccountSize(AccountName.Whirlpool);

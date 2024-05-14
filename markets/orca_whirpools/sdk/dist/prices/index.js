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
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.defaultGetPricesThresholdConfig = exports.defaultGetPricesConfig = exports.defaultQuoteTokens = void 0;
const web3_js_1 = require("@solana/web3.js");
const bn_js_1 = __importDefault(require("bn.js"));
const public_1 = require("../types/public");
const constants_1 = require("../utils/constants");
__exportStar(require("./price-module"), exports);
/**
 * The default quote tokens used for Orca's mainnet deployment.
 * Supply your own if you are using a different deployment.
 * @category PriceModule
 */
exports.defaultQuoteTokens = [
    constants_1.TOKEN_MINTS["USDC"],
    constants_1.TOKEN_MINTS["SOL"],
    constants_1.TOKEN_MINTS["mSOL"],
    constants_1.TOKEN_MINTS["stSOL"],
].map((mint) => new web3_js_1.PublicKey(mint));
/**
 * The default {@link GetPricesConfig} config for Orca's mainnet deployment.
 * @category PriceModule
 */
exports.defaultGetPricesConfig = {
    quoteTokens: exports.defaultQuoteTokens,
    tickSpacings: public_1.ORCA_SUPPORTED_TICK_SPACINGS,
    programId: public_1.ORCA_WHIRLPOOL_PROGRAM_ID,
    whirlpoolsConfig: public_1.ORCA_WHIRLPOOLS_CONFIG,
};
/**
 * The default {@link GetPricesThresholdConfig} config for Orca's mainnet deployment.
 * @category PriceModule
 */
exports.defaultGetPricesThresholdConfig = {
    amountOut: new bn_js_1.default(1000000000),
    priceImpactThreshold: 1.05,
};

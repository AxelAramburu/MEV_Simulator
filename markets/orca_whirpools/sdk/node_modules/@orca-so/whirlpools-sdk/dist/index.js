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
const decimal_js_1 = __importDefault(require("decimal.js"));
__exportStar(require("./context"), exports);
__exportStar(require("./impl/position-impl"), exports);
__exportStar(require("./ix"), exports);
__exportStar(require("./network/public"), exports);
__exportStar(require("./prices"), exports);
__exportStar(require("./quotes/public"), exports);
__exportStar(require("./router/public"), exports);
__exportStar(require("./types/public"), exports);
__exportStar(require("./types/public/anchor-types"), exports);
__exportStar(require("./utils/public"), exports);
__exportStar(require("./whirlpool-client"), exports);
// Global rules for Decimals
//  - 40 digits of precision for the largest number
//  - 20 digits of precision for the smallest number
//  - Always round towards 0 to mirror smart contract rules
decimal_js_1.default.set({ precision: 40, toExpPos: 40, toExpNeg: -20, rounding: 1 });

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WhirlpoolsError = exports.RouteQueryErrorCode = exports.SwapErrorCode = exports.TokenErrorCode = exports.MathErrorCode = void 0;
var MathErrorCode;
(function (MathErrorCode) {
    MathErrorCode["MultiplicationOverflow"] = "MultiplicationOverflow";
    MathErrorCode["MulDivOverflow"] = "MulDivOverflow";
    MathErrorCode["MultiplicationShiftRightOverflow"] = "MultiplicationShiftRightOverflow";
    MathErrorCode["DivideByZero"] = "DivideByZero";
})(MathErrorCode || (exports.MathErrorCode = MathErrorCode = {}));
var TokenErrorCode;
(function (TokenErrorCode) {
    TokenErrorCode["TokenMaxExceeded"] = "TokenMaxExceeded";
    TokenErrorCode["TokenMinSubceeded"] = "TokenMinSubceeded";
})(TokenErrorCode || (exports.TokenErrorCode = TokenErrorCode = {}));
var SwapErrorCode;
(function (SwapErrorCode) {
    SwapErrorCode["InvalidDevFeePercentage"] = "InvalidDevFeePercentage";
    SwapErrorCode["InvalidSqrtPriceLimitDirection"] = "InvalidSqrtPriceLimitDirection";
    SwapErrorCode["SqrtPriceOutOfBounds"] = "SqrtPriceOutOfBounds";
    SwapErrorCode["ZeroTradableAmount"] = "ZeroTradableAmount";
    SwapErrorCode["AmountOutBelowMinimum"] = "AmountOutBelowMinimum";
    SwapErrorCode["AmountInAboveMaximum"] = "AmountInAboveMaximum";
    SwapErrorCode["TickArrayCrossingAboveMax"] = "TickArrayCrossingAboveMax";
    SwapErrorCode["TickArrayIndexNotInitialized"] = "TickArrayIndexNotInitialized";
    SwapErrorCode["TickArraySequenceInvalid"] = "TickArraySequenceInvalid";
})(SwapErrorCode || (exports.SwapErrorCode = SwapErrorCode = {}));
var RouteQueryErrorCode;
(function (RouteQueryErrorCode) {
    RouteQueryErrorCode["RouteDoesNotExist"] = "RouteDoesNotExist";
    RouteQueryErrorCode["TradeAmountTooHigh"] = "TradeAmountTooHigh";
    RouteQueryErrorCode["ZeroInputAmount"] = "ZeroInputAmount";
    RouteQueryErrorCode["General"] = "General";
})(RouteQueryErrorCode || (exports.RouteQueryErrorCode = RouteQueryErrorCode = {}));
class WhirlpoolsError extends Error {
    constructor(message, errorCode, stack) {
        super(message);
        this.message = message;
        this.errorCode = errorCode;
        this.stack = stack;
    }
    static isWhirlpoolsErrorCode(e, code) {
        return e instanceof WhirlpoolsError && e.errorCode === code;
    }
}
exports.WhirlpoolsError = WhirlpoolsError;

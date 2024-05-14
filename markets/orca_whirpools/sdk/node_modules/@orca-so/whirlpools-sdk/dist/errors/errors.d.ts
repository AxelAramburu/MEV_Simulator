export declare enum MathErrorCode {
    MultiplicationOverflow = "MultiplicationOverflow",
    MulDivOverflow = "MulDivOverflow",
    MultiplicationShiftRightOverflow = "MultiplicationShiftRightOverflow",
    DivideByZero = "DivideByZero"
}
export declare enum TokenErrorCode {
    TokenMaxExceeded = "TokenMaxExceeded",
    TokenMinSubceeded = "TokenMinSubceeded"
}
export declare enum SwapErrorCode {
    InvalidDevFeePercentage = "InvalidDevFeePercentage",
    InvalidSqrtPriceLimitDirection = "InvalidSqrtPriceLimitDirection",
    SqrtPriceOutOfBounds = "SqrtPriceOutOfBounds",
    ZeroTradableAmount = "ZeroTradableAmount",
    AmountOutBelowMinimum = "AmountOutBelowMinimum",
    AmountInAboveMaximum = "AmountInAboveMaximum",
    TickArrayCrossingAboveMax = "TickArrayCrossingAboveMax",
    TickArrayIndexNotInitialized = "TickArrayIndexNotInitialized",
    TickArraySequenceInvalid = "TickArraySequenceInvalid"
}
export declare enum RouteQueryErrorCode {
    RouteDoesNotExist = "RouteDoesNotExist",
    TradeAmountTooHigh = "TradeAmountTooHigh",
    ZeroInputAmount = "ZeroInputAmount",
    General = "General"
}
export type WhirlpoolsErrorCode = TokenErrorCode | SwapErrorCode | MathErrorCode | RouteQueryErrorCode;
export declare class WhirlpoolsError extends Error {
    message: string;
    errorCode?: WhirlpoolsErrorCode;
    constructor(message: string, errorCode?: WhirlpoolsErrorCode, stack?: string);
    static isWhirlpoolsErrorCode(e: any, code: WhirlpoolsErrorCode): boolean;
}

export declare class TickArrayIndex {
    readonly arrayIndex: number;
    readonly offsetIndex: number;
    readonly tickSpacing: number;
    static fromTickIndex(index: number, tickSpacing: number): TickArrayIndex;
    constructor(arrayIndex: number, offsetIndex: number, tickSpacing: number);
    toTickIndex(): number;
    toNextInitializableTickIndex(): TickArrayIndex;
    toPrevInitializableTickIndex(): TickArrayIndex;
}

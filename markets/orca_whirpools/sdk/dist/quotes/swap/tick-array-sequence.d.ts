import { TickArray, TickData } from "../../types/public";
import { PublicKey } from "@solana/web3.js";
/**
 * NOTE: differs from contract method of having the swap manager keep track of array index.
 * This is due to the initial requirement to lazy load tick-arrays. This requirement is no longer necessary.
 */
export declare class TickArraySequence {
    readonly tickSpacing: number;
    readonly aToB: boolean;
    private sequence;
    private touchedArrays;
    private startArrayIndex;
    constructor(tickArrays: Readonly<TickArray[]>, tickSpacing: number, aToB: boolean);
    isValidTickArray0(tickCurrentIndex: number): boolean;
    getNumOfTouchedArrays(): number;
    getTouchedArrays(minArraySize: number): PublicKey[];
    getTick(index: number): TickData;
    /**
     * if a->b, currIndex is included in the search
     * if b->a, currIndex is always ignored
     * @param currIndex
     * @returns
     */
    findNextInitializedTickIndex(currIndex: number): {
        nextIndex: number;
        nextTickData: TickData;
    } | {
        nextIndex: number;
        nextTickData: null;
    };
    private getLocalArrayIndex;
    /**
     * Check whether the array index potentially exists in this sequence.
     * Note: assumes the sequence of tick-arrays are sequential
     * @param index
     */
    private isArrayIndexInBounds;
    private checkIfIndexIsInTickArrayRange;
}

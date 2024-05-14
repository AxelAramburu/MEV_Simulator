import { Address } from "@coral-xyz/anchor";
import { PDA } from "@orca-so/common-sdk";
import { PublicKey } from "@solana/web3.js";
import { WhirlpoolAccountFetchOptions, WhirlpoolAccountFetcherInterface } from "../../network/public/fetcher";
import { TickArrayData, TickData } from "../../types/public";
/**
 * A collection of utility functions when interacting with Ticks.
 * @category Whirlpool Utils
 */
export declare class TickUtil {
    private constructor();
    /**
     * Get the offset index to access a tick at a given tick-index in a tick-array
     *
     * @param tickIndex The tick index for the tick that this offset would access
     * @param arrayStartIndex The starting tick for the array that this tick-index resides in
     * @param tickSpacing The tickSpacing for the Whirlpool that this tickArray belongs to
     * @returns The offset index that can access the desired tick at the given tick-array
     */
    static getOffsetIndex(tickIndex: number, arrayStartIndex: number, tickSpacing: number): number;
    /**
     * Get the startIndex of the tick array containing tickIndex.
     *
     * @param tickIndex
     * @param tickSpacing
     * @param offset can be used to get neighboring tick array startIndex.
     * @returns
     */
    static getStartTickIndex(tickIndex: number, tickSpacing: number, offset?: number): number;
    /**
     * Get the nearest (rounding down) valid tick index from the tickIndex.
     * A valid tick index is a point on the tick spacing grid line.
     */
    static getInitializableTickIndex(tickIndex: number, tickSpacing: number): number;
    static getNextInitializableTickIndex(tickIndex: number, tickSpacing: number): number;
    static getPrevInitializableTickIndex(tickIndex: number, tickSpacing: number): number;
    /**
     * Get the previous initialized tick index within the same tick array.
     *
     * @param account
     * @param currentTickIndex
     * @param tickSpacing
     * @returns
     */
    static findPreviousInitializedTickIndex(account: TickArrayData, currentTickIndex: number, tickSpacing: number): number | null;
    /**
     * Get the next initialized tick index within the same tick array.
     * @param account
     * @param currentTickIndex
     * @param tickSpacing
     * @returns
     */
    static findNextInitializedTickIndex(account: TickArrayData, currentTickIndex: number, tickSpacing: number): number | null;
    private static findInitializedTick;
    static checkTickInBounds(tick: number): boolean;
    static isTickInitializable(tick: number, tickSpacing: number): boolean;
    /**
     *
     * Returns the tick for the inverse of the price that this tick represents.
     * Eg: Consider tick i where Pb/Pa = 1.0001 ^ i
     * inverse of this, i.e. Pa/Pb = 1 / (1.0001 ^ i) = 1.0001^-i
     * @param tick The tick to invert
     * @returns
     */
    static invertTick(tick: number): number;
    /**
     * Get the minimum and maximum tick index that can be initialized.
     *
     * @param tickSpacing The tickSpacing for the Whirlpool
     * @returns An array of numbers where the first element is the minimum tick index and the second element is the maximum tick index.
     */
    static getFullRangeTickIndex(tickSpacing: number): [number, number];
    /**
     * Check if the tick range is the full range of the Whirlpool.
     * @param tickSpacing The tickSpacing for the Whirlpool
     * @param tickLowerIndex The lower tick index of the range
     * @param tickUpperIndex The upper tick index of the range
     * @returns true if the range is the full range of the Whirlpool, false otherwise.
     */
    static isFullRange(tickSpacing: number, tickLowerIndex: number, tickUpperIndex: number): boolean;
}
/**
 * A collection of utility functions when interacting with a TickArray.
 * @category Whirlpool Utils
 */
export declare class TickArrayUtil {
    /**
     * Get the tick from tickArray with a global tickIndex.
     */
    static getTickFromArray(tickArray: TickArrayData, tickIndex: number, tickSpacing: number): TickData;
    /**
     * Return a sequence of tick array pdas based on the sequence start index.
     * @param tick - A tick in the first tick-array of your sequence
     * @param tickSpacing - Tick spacing for the whirlpool
     * @param numOfTickArrays - The number of TickArray PDAs to generate
     * @param programId - Program Id of the whirlpool for these tick-arrays
     * @param whirlpoolAddress - Address for the Whirlpool for these tick-arrays
     * @returns TickArray PDAs for the sequence`
     */
    static getTickArrayPDAs(tick: number, tickSpacing: number, numOfTickArrays: number, programId: PublicKey, whirlpoolAddress: PublicKey, aToB: boolean): PDA[];
    /**
     * Return a string containing all of the uninitialized arrays in the provided addresses.
     * Useful for creating error messages.
     *
     * @param tickArrayAddrs - A list of tick-array addresses to verify.
     * @param cache - {@link WhirlpoolAccountFetcherInterface}
     * @param opts an {@link WhirlpoolAccountFetchOptions} object to define fetch and cache options when accessing on-chain accounts
     * @returns A string of all uninitialized tick array addresses, delimited by ",". Falsy value if all arrays are initialized.
     */
    static getUninitializedArraysString(tickArrayAddrs: Address[], fetcher: WhirlpoolAccountFetcherInterface, opts?: WhirlpoolAccountFetchOptions): Promise<string | null>;
    static getUninitializedArraysPDAs(ticks: number[], programId: PublicKey, whirlpoolAddress: PublicKey, tickSpacing: number, fetcher: WhirlpoolAccountFetcherInterface, opts: WhirlpoolAccountFetchOptions): Promise<{
        startIndex: number;
        pda: PDA;
    }[]>;
    /**
     * Evaluate a list of tick-array data and return the array of indices which the tick-arrays are not initialized.
     * @param tickArrays - a list of TickArrayData or null objects from WhirlpoolAccountCacheInterface.getTickArrays
     * @returns an array of array-index for the input tickArrays that requires initialization.
     */
    static getUninitializedArrays(tickArrays: readonly (TickArrayData | null)[]): number[];
}

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TickArrayUtil = exports.TickUtil = void 0;
const common_sdk_1 = require("@orca-so/common-sdk");
const tiny_invariant_1 = __importDefault(require("tiny-invariant"));
const public_1 = require("../../types/public");
const pda_utils_1 = require("./pda-utils");
var TickSearchDirection;
(function (TickSearchDirection) {
    TickSearchDirection[TickSearchDirection["Left"] = 0] = "Left";
    TickSearchDirection[TickSearchDirection["Right"] = 1] = "Right";
})(TickSearchDirection || (TickSearchDirection = {}));
/**
 * A collection of utility functions when interacting with Ticks.
 * @category Whirlpool Utils
 */
class TickUtil {
    constructor() { }
    /**
     * Get the offset index to access a tick at a given tick-index in a tick-array
     *
     * @param tickIndex The tick index for the tick that this offset would access
     * @param arrayStartIndex The starting tick for the array that this tick-index resides in
     * @param tickSpacing The tickSpacing for the Whirlpool that this tickArray belongs to
     * @returns The offset index that can access the desired tick at the given tick-array
     */
    static getOffsetIndex(tickIndex, arrayStartIndex, tickSpacing) {
        return Math.floor((tickIndex - arrayStartIndex) / tickSpacing);
    }
    /**
     * Get the startIndex of the tick array containing tickIndex.
     *
     * @param tickIndex
     * @param tickSpacing
     * @param offset can be used to get neighboring tick array startIndex.
     * @returns
     */
    static getStartTickIndex(tickIndex, tickSpacing, offset = 0) {
        const realIndex = Math.floor(tickIndex / tickSpacing / public_1.TICK_ARRAY_SIZE);
        const startTickIndex = (realIndex + offset) * tickSpacing * public_1.TICK_ARRAY_SIZE;
        const ticksInArray = public_1.TICK_ARRAY_SIZE * tickSpacing;
        const minTickIndex = public_1.MIN_TICK_INDEX - ((public_1.MIN_TICK_INDEX % ticksInArray) + ticksInArray);
        (0, tiny_invariant_1.default)(startTickIndex >= minTickIndex, `startTickIndex is too small - - ${startTickIndex}`);
        (0, tiny_invariant_1.default)(startTickIndex <= public_1.MAX_TICK_INDEX, `startTickIndex is too large - ${startTickIndex}`);
        return startTickIndex;
    }
    /**
     * Get the nearest (rounding down) valid tick index from the tickIndex.
     * A valid tick index is a point on the tick spacing grid line.
     */
    static getInitializableTickIndex(tickIndex, tickSpacing) {
        return tickIndex - (tickIndex % tickSpacing);
    }
    static getNextInitializableTickIndex(tickIndex, tickSpacing) {
        return TickUtil.getInitializableTickIndex(tickIndex, tickSpacing) + tickSpacing;
    }
    static getPrevInitializableTickIndex(tickIndex, tickSpacing) {
        return TickUtil.getInitializableTickIndex(tickIndex, tickSpacing) - tickSpacing;
    }
    /**
     * Get the previous initialized tick index within the same tick array.
     *
     * @param account
     * @param currentTickIndex
     * @param tickSpacing
     * @returns
     */
    static findPreviousInitializedTickIndex(account, currentTickIndex, tickSpacing) {
        return TickUtil.findInitializedTick(account, currentTickIndex, tickSpacing, TickSearchDirection.Left);
    }
    /**
     * Get the next initialized tick index within the same tick array.
     * @param account
     * @param currentTickIndex
     * @param tickSpacing
     * @returns
     */
    static findNextInitializedTickIndex(account, currentTickIndex, tickSpacing) {
        return TickUtil.findInitializedTick(account, currentTickIndex, tickSpacing, TickSearchDirection.Right);
    }
    static findInitializedTick(account, currentTickIndex, tickSpacing, searchDirection) {
        const currentTickArrayIndex = tickIndexToInnerIndex(account.startTickIndex, currentTickIndex, tickSpacing);
        const increment = searchDirection === TickSearchDirection.Right ? 1 : -1;
        let stepInitializedTickArrayIndex = searchDirection === TickSearchDirection.Right
            ? currentTickArrayIndex + increment
            : currentTickArrayIndex;
        while (stepInitializedTickArrayIndex >= 0 &&
            stepInitializedTickArrayIndex < account.ticks.length) {
            if (account.ticks[stepInitializedTickArrayIndex]?.initialized) {
                return innerIndexToTickIndex(account.startTickIndex, stepInitializedTickArrayIndex, tickSpacing);
            }
            stepInitializedTickArrayIndex += increment;
        }
        return null;
    }
    static checkTickInBounds(tick) {
        return tick <= public_1.MAX_TICK_INDEX && tick >= public_1.MIN_TICK_INDEX;
    }
    static isTickInitializable(tick, tickSpacing) {
        return tick % tickSpacing === 0;
    }
    /**
     *
     * Returns the tick for the inverse of the price that this tick represents.
     * Eg: Consider tick i where Pb/Pa = 1.0001 ^ i
     * inverse of this, i.e. Pa/Pb = 1 / (1.0001 ^ i) = 1.0001^-i
     * @param tick The tick to invert
     * @returns
     */
    static invertTick(tick) {
        return -tick;
    }
    /**
     * Get the minimum and maximum tick index that can be initialized.
     *
     * @param tickSpacing The tickSpacing for the Whirlpool
     * @returns An array of numbers where the first element is the minimum tick index and the second element is the maximum tick index.
     */
    static getFullRangeTickIndex(tickSpacing) {
        return [
            Math.ceil(public_1.MIN_TICK_INDEX / tickSpacing) * tickSpacing,
            Math.floor(public_1.MAX_TICK_INDEX / tickSpacing) * tickSpacing,
        ];
    }
    /**
     * Check if the tick range is the full range of the Whirlpool.
     * @param tickSpacing The tickSpacing for the Whirlpool
     * @param tickLowerIndex The lower tick index of the range
     * @param tickUpperIndex The upper tick index of the range
     * @returns true if the range is the full range of the Whirlpool, false otherwise.
     */
    static isFullRange(tickSpacing, tickLowerIndex, tickUpperIndex) {
        const [min, max] = TickUtil.getFullRangeTickIndex(tickSpacing);
        return tickLowerIndex === min && tickUpperIndex === max;
    }
}
exports.TickUtil = TickUtil;
/**
 * A collection of utility functions when interacting with a TickArray.
 * @category Whirlpool Utils
 */
class TickArrayUtil {
    /**
     * Get the tick from tickArray with a global tickIndex.
     */
    static getTickFromArray(tickArray, tickIndex, tickSpacing) {
        const realIndex = tickIndexToInnerIndex(tickArray.startTickIndex, tickIndex, tickSpacing);
        const tick = tickArray.ticks[realIndex];
        (0, tiny_invariant_1.default)(!!tick, `tick realIndex out of range - start - ${tickArray.startTickIndex} index - ${tickIndex}, realIndex - ${realIndex}`);
        return tick;
    }
    /**
     * Return a sequence of tick array pdas based on the sequence start index.
     * @param tick - A tick in the first tick-array of your sequence
     * @param tickSpacing - Tick spacing for the whirlpool
     * @param numOfTickArrays - The number of TickArray PDAs to generate
     * @param programId - Program Id of the whirlpool for these tick-arrays
     * @param whirlpoolAddress - Address for the Whirlpool for these tick-arrays
     * @returns TickArray PDAs for the sequence`
     */
    static getTickArrayPDAs(tick, tickSpacing, numOfTickArrays, programId, whirlpoolAddress, aToB) {
        let arrayIndexList = [...Array(numOfTickArrays).keys()];
        if (aToB) {
            arrayIndexList = arrayIndexList.map((value) => -value);
        }
        return arrayIndexList.map((value) => {
            const startTick = TickUtil.getStartTickIndex(tick, tickSpacing, value);
            return pda_utils_1.PDAUtil.getTickArray(programId, whirlpoolAddress, startTick);
        });
    }
    /**
     * Return a string containing all of the uninitialized arrays in the provided addresses.
     * Useful for creating error messages.
     *
     * @param tickArrayAddrs - A list of tick-array addresses to verify.
     * @param cache - {@link WhirlpoolAccountFetcherInterface}
     * @param opts an {@link WhirlpoolAccountFetchOptions} object to define fetch and cache options when accessing on-chain accounts
     * @returns A string of all uninitialized tick array addresses, delimited by ",". Falsy value if all arrays are initialized.
     */
    static async getUninitializedArraysString(tickArrayAddrs, fetcher, opts) {
        const taAddrs = common_sdk_1.AddressUtil.toPubKeys(tickArrayAddrs);
        const tickArrayData = await fetcher.getTickArrays(taAddrs, opts);
        // Verify tick arrays are initialized if the user provided them.
        if (tickArrayData) {
            const uninitializedIndices = TickArrayUtil.getUninitializedArrays(tickArrayData);
            if (uninitializedIndices.length > 0) {
                const uninitializedArrays = uninitializedIndices
                    .map((index) => taAddrs[index].toBase58())
                    .join(", ");
                return uninitializedArrays;
            }
        }
        return null;
    }
    static async getUninitializedArraysPDAs(ticks, programId, whirlpoolAddress, tickSpacing, fetcher, opts) {
        const startTicks = ticks.map((tick) => TickUtil.getStartTickIndex(tick, tickSpacing));
        const removeDupeTicks = [...new Set(startTicks)];
        const tickArrayPDAs = removeDupeTicks.map((tick) => pda_utils_1.PDAUtil.getTickArray(programId, whirlpoolAddress, tick));
        const fetchedArrays = await fetcher.getTickArrays(tickArrayPDAs.map((pda) => pda.publicKey), opts);
        const uninitializedIndices = TickArrayUtil.getUninitializedArrays(fetchedArrays);
        return uninitializedIndices.map((index) => {
            return {
                startIndex: removeDupeTicks[index],
                pda: tickArrayPDAs[index],
            };
        });
    }
    /**
     * Evaluate a list of tick-array data and return the array of indices which the tick-arrays are not initialized.
     * @param tickArrays - a list of TickArrayData or null objects from WhirlpoolAccountCacheInterface.getTickArrays
     * @returns an array of array-index for the input tickArrays that requires initialization.
     */
    static getUninitializedArrays(tickArrays) {
        return tickArrays
            .map((value, index) => {
            if (!value) {
                return index;
            }
            return -1;
        })
            .filter((index) => index >= 0);
    }
}
exports.TickArrayUtil = TickArrayUtil;
function tickIndexToInnerIndex(startTickIndex, tickIndex, tickSpacing) {
    return Math.floor((tickIndex - startTickIndex) / tickSpacing);
}
function innerIndexToTickIndex(startTickIndex, tickArrayIndex, tickSpacing) {
    return startTickIndex + tickArrayIndex * tickSpacing;
}

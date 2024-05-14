"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PositionBundleUtil = void 0;
const tiny_invariant_1 = __importDefault(require("tiny-invariant"));
const public_1 = require("../../types/public");
/**
 * A collection of utility functions when interacting with a PositionBundle.
 * @category Whirlpool Utils
 */
class PositionBundleUtil {
    constructor() { }
    /**
     * Check if the bundle index is in the correct range.
     *
     * @param bundleIndex The bundle index to be checked
     * @returns true if bundle index is in the correct range
     */
    static checkBundleIndexInBounds(bundleIndex) {
        return bundleIndex >= 0 && bundleIndex < public_1.POSITION_BUNDLE_SIZE;
    }
    /**
     * Check if the Bundled Position corresponding to the bundle index has been opened.
     *
     * @param positionBundle The position bundle to be checked
     * @param bundleIndex The bundle index to be checked
     * @returns true if Bundled Position has been opened
     */
    static isOccupied(positionBundle, bundleIndex) {
        (0, tiny_invariant_1.default)(PositionBundleUtil.checkBundleIndexInBounds(bundleIndex), "bundleIndex out of range");
        const array = PositionBundleUtil.convertBitmapToArray(positionBundle);
        return array[bundleIndex];
    }
    /**
     * Check if the Bundled Position corresponding to the bundle index has not been opened.
     *
     * @param positionBundle The position bundle to be checked
     * @param bundleIndex The bundle index to be checked
     * @returns true if Bundled Position has not been opened
     */
    static isUnoccupied(positionBundle, bundleIndex) {
        return !PositionBundleUtil.isOccupied(positionBundle, bundleIndex);
    }
    /**
     * Check if all bundle index is occupied.
     *
     * @param positionBundle The position bundle to be checked
     * @returns true if all bundle index is occupied
     */
    static isFull(positionBundle) {
        const unoccupied = PositionBundleUtil.getUnoccupiedBundleIndexes(positionBundle);
        return unoccupied.length === 0;
    }
    /**
     * Check if all bundle index is unoccupied.
     *
     * @param positionBundle The position bundle to be checked
     * @returns true if all bundle index is unoccupied
     */
    static isEmpty(positionBundle) {
        const occupied = PositionBundleUtil.getOccupiedBundleIndexes(positionBundle);
        return occupied.length === 0;
    }
    /**
     * Get all bundle indexes where the corresponding Bundled Position is open.
     *
     * @param positionBundle The position bundle to be checked
     * @returns The array of bundle index where the corresponding Bundled Position is open
     */
    static getOccupiedBundleIndexes(positionBundle) {
        const result = [];
        PositionBundleUtil.convertBitmapToArray(positionBundle).forEach((occupied, index) => {
            if (occupied) {
                result.push(index);
            }
        });
        return result;
    }
    /**
     * Get all bundle indexes where the corresponding Bundled Position is not open.
     *
     * @param positionBundle The position bundle to be checked
     * @returns The array of bundle index where the corresponding Bundled Position is not open
     */
    static getUnoccupiedBundleIndexes(positionBundle) {
        const result = [];
        PositionBundleUtil.convertBitmapToArray(positionBundle).forEach((occupied, index) => {
            if (!occupied) {
                result.push(index);
            }
        });
        return result;
    }
    /**
     * Get the first unoccupied bundle index in the position bundle.
     *
     * @param positionBundle The position bundle to be checked
     * @returns The first unoccupied bundle index, null if the position bundle is full
     */
    static findUnoccupiedBundleIndex(positionBundle) {
        const unoccupied = PositionBundleUtil.getUnoccupiedBundleIndexes(positionBundle);
        return unoccupied.length === 0 ? null : unoccupied[0];
    }
    /**
     * Convert position bitmap to the array of boolean which represent if Bundled Position is open.
     *
     * @param positionBundle The position bundle whose bitmap will be converted
     * @returns The array of boolean representing if Bundled Position is open
     */
    static convertBitmapToArray(positionBundle) {
        const result = [];
        positionBundle.positionBitmap.map((bitmap) => {
            for (let offset = 0; offset < 8; offset++) {
                result.push((bitmap & (1 << offset)) !== 0);
            }
        });
        return result;
    }
}
exports.PositionBundleUtil = PositionBundleUtil;

import { PositionBundleData } from "../../types/public";
/**
 * A collection of utility functions when interacting with a PositionBundle.
 * @category Whirlpool Utils
 */
export declare class PositionBundleUtil {
    private constructor();
    /**
     * Check if the bundle index is in the correct range.
     *
     * @param bundleIndex The bundle index to be checked
     * @returns true if bundle index is in the correct range
     */
    static checkBundleIndexInBounds(bundleIndex: number): boolean;
    /**
     * Check if the Bundled Position corresponding to the bundle index has been opened.
     *
     * @param positionBundle The position bundle to be checked
     * @param bundleIndex The bundle index to be checked
     * @returns true if Bundled Position has been opened
     */
    static isOccupied(positionBundle: PositionBundleData, bundleIndex: number): boolean;
    /**
     * Check if the Bundled Position corresponding to the bundle index has not been opened.
     *
     * @param positionBundle The position bundle to be checked
     * @param bundleIndex The bundle index to be checked
     * @returns true if Bundled Position has not been opened
     */
    static isUnoccupied(positionBundle: PositionBundleData, bundleIndex: number): boolean;
    /**
     * Check if all bundle index is occupied.
     *
     * @param positionBundle The position bundle to be checked
     * @returns true if all bundle index is occupied
     */
    static isFull(positionBundle: PositionBundleData): boolean;
    /**
     * Check if all bundle index is unoccupied.
     *
     * @param positionBundle The position bundle to be checked
     * @returns true if all bundle index is unoccupied
     */
    static isEmpty(positionBundle: PositionBundleData): boolean;
    /**
     * Get all bundle indexes where the corresponding Bundled Position is open.
     *
     * @param positionBundle The position bundle to be checked
     * @returns The array of bundle index where the corresponding Bundled Position is open
     */
    static getOccupiedBundleIndexes(positionBundle: PositionBundleData): number[];
    /**
     * Get all bundle indexes where the corresponding Bundled Position is not open.
     *
     * @param positionBundle The position bundle to be checked
     * @returns The array of bundle index where the corresponding Bundled Position is not open
     */
    static getUnoccupiedBundleIndexes(positionBundle: PositionBundleData): number[];
    /**
     * Get the first unoccupied bundle index in the position bundle.
     *
     * @param positionBundle The position bundle to be checked
     * @returns The first unoccupied bundle index, null if the position bundle is full
     */
    static findUnoccupiedBundleIndex(positionBundle: PositionBundleData): number | null;
    /**
     * Convert position bitmap to the array of boolean which represent if Bundled Position is open.
     *
     * @param positionBundle The position bundle whose bitmap will be converted
     * @returns The array of boolean representing if Bundled Position is open
     */
    static convertBitmapToArray(positionBundle: PositionBundleData): boolean[];
}

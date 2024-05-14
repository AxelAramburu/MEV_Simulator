/// <reference types="bn.js" />
import { BN } from "@coral-xyz/anchor";
import { PublicKey } from "@solana/web3.js";
/**
 * @category Whirlpool Utils
 */
export declare class PDAUtil {
    /**
     *
     * @param programId
     * @param whirlpoolsConfigKey
     * @param tokenMintAKey
     * @param tokenMintBKey
     * @param tickSpacing
     * @returns
     */
    static getWhirlpool(programId: PublicKey, whirlpoolsConfigKey: PublicKey, tokenMintAKey: PublicKey, tokenMintBKey: PublicKey, tickSpacing: number): import("@orca-so/common-sdk").PDA;
    /**
     * @category Program Derived Addresses
     * @param programId
     * @param positionMintKey
     * @returns
     */
    static getPosition(programId: PublicKey, positionMintKey: PublicKey): import("@orca-so/common-sdk").PDA;
    /**
     * @category Program Derived Addresses
     * @param positionMintKey
     * @returns
     */
    static getPositionMetadata(positionMintKey: PublicKey): import("@orca-so/common-sdk").PDA;
    /**
     * @category Program Derived Addresses
     * @param programId
     * @param whirlpoolAddress
     * @param startTick
     * @returns
     */
    static getTickArray(programId: PublicKey, whirlpoolAddress: PublicKey, startTick: number): import("@orca-so/common-sdk").PDA;
    /**
     * Get the PDA of the tick array containing tickIndex.
     * tickArrayOffset can be used to get neighboring tick arrays.
     *
     * @param tickIndex
     * @param tickSpacing
     * @param whirlpool
     * @param programId
     * @param tickArrayOffset
     * @returns
     */
    static getTickArrayFromTickIndex(tickIndex: number, tickSpacing: number, whirlpool: PublicKey, programId: PublicKey, tickArrayOffset?: number): import("@orca-so/common-sdk").PDA;
    static getTickArrayFromSqrtPrice(sqrtPriceX64: BN, tickSpacing: number, whirlpool: PublicKey, programId: PublicKey, tickArrayOffset?: number): import("@orca-so/common-sdk").PDA;
    /**
     * @category Program Derived Addresses
     * @param programId
     * @param whirlpoolsConfigAddress
     * @param tickSpacing
     * @returns
     */
    static getFeeTier(programId: PublicKey, whirlpoolsConfigAddress: PublicKey, tickSpacing: number): import("@orca-so/common-sdk").PDA;
    /**
     * @category Program Derived Addresses
     * @param programId
     * @param whirlpoolAddress
     * @returns
     */
    static getOracle(programId: PublicKey, whirlpoolAddress: PublicKey): import("@orca-so/common-sdk").PDA;
    /**
     * @category Program Derived Addresses
     * @param programId
     * @param positionBundleMintKey
     * @param bundleIndex
     * @returns
     */
    static getBundledPosition(programId: PublicKey, positionBundleMintKey: PublicKey, bundleIndex: number): import("@orca-so/common-sdk").PDA;
    /**
     * @category Program Derived Addresses
     * @param programId
     * @param positionBundleMintKey
     * @returns
     */
    static getPositionBundle(programId: PublicKey, positionBundleMintKey: PublicKey): import("@orca-so/common-sdk").PDA;
    /**
     * @category Program Derived Addresses
     * @param positionBundleMintKey
     * @returns
     */
    static getPositionBundleMetadata(positionBundleMintKey: PublicKey): import("@orca-so/common-sdk").PDA;
}

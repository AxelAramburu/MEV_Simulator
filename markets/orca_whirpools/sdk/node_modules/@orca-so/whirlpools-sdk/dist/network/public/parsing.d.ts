/// <reference types="node" />
import { AccountInfo, PublicKey } from "@solana/web3.js";
import { FeeTierData, PositionBundleData, PositionData, TickArrayData, WhirlpoolData, WhirlpoolsConfigData } from "../../types/public";
/**
 * @category Network
 */
export declare class ParsableWhirlpoolsConfig {
    private constructor();
    static parse(address: PublicKey, accountData: AccountInfo<Buffer> | undefined | null): WhirlpoolsConfigData | null;
}
/**
 * @category Network
 */
export declare class ParsableWhirlpool {
    private constructor();
    static parse(address: PublicKey, accountData: AccountInfo<Buffer> | undefined | null): WhirlpoolData | null;
}
/**
 * @category Network
 */
export declare class ParsablePosition {
    private constructor();
    static parse(address: PublicKey, accountData: AccountInfo<Buffer> | undefined | null): PositionData | null;
}
/**
 * @category Network
 */
export declare class ParsableTickArray {
    private constructor();
    static parse(address: PublicKey, accountData: AccountInfo<Buffer> | undefined | null): TickArrayData | null;
}
/**
 * @category Network
 */
export declare class ParsableFeeTier {
    private constructor();
    static parse(address: PublicKey, accountData: AccountInfo<Buffer> | undefined | null): FeeTierData | null;
}
/**
 * @category Network
 */
export declare class ParsablePositionBundle {
    private constructor();
    static parse(address: PublicKey, accountData: AccountInfo<Buffer> | undefined | null): PositionBundleData | null;
}

import { PublicKey } from "@solana/web3.js";
export declare class PublicKeyUtils {
    /**
     * Check whether a string is a Base58 string.
     * @param value
     * @returns Whether the string is a Base58 string.
     */
    static isBase58(value: string): boolean;
    /**
     * Order a list of public keys by bytes.
     * @param keys a list of public keys to order
     * @returns an ordered array of public keys
     */
    static orderKeys(...keys: PublicKey[]): PublicKey[];
}

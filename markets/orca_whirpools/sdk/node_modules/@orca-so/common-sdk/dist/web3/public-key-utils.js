"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PublicKeyUtils = void 0;
class PublicKeyUtils {
    /**
     * Check whether a string is a Base58 string.
     * @param value
     * @returns Whether the string is a Base58 string.
     */
    static isBase58(value) {
        return /^[A-HJ-NP-Za-km-z1-9]*$/.test(value);
    }
    /**
     * Order a list of public keys by bytes.
     * @param keys a list of public keys to order
     * @returns an ordered array of public keys
     */
    static orderKeys(...keys) {
        return keys.sort(comparePublicKeys);
    }
}
exports.PublicKeyUtils = PublicKeyUtils;
function comparePublicKeys(key1, key2) {
    const bytes1 = key1.toBytes();
    const bytes2 = key2.toBytes();
    // PublicKeys should be zero-padded 32 byte length
    if (bytes1.byteLength !== bytes2.byteLength) {
        return bytes1.byteLength - bytes2.byteLength;
    }
    for (let i = 0; i < bytes1.byteLength; i++) {
        let byte1 = bytes1[i];
        let byte2 = bytes2[i];
        if (byte1 !== byte2) {
            return byte1 - byte2;
        }
    }
    return 0;
}

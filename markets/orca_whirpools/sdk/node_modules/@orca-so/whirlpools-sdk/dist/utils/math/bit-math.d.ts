/// <reference types="bn.js" />
import { BN } from "@coral-xyz/anchor";
export declare class BitMath {
    static mul(n0: BN, n1: BN, limit: number): BN;
    static mulDiv(n0: BN, n1: BN, d: BN, limit: number): BN;
    static mulDivRoundUp(n0: BN, n1: BN, d: BN, limit: number): BN;
    static mulDivRoundUpIf(n0: BN, n1: BN, d: BN, roundUp: boolean, limit: number): BN;
    static checked_mul_shift_right(n0: BN, n1: BN, limit: number): BN;
    static checked_mul_shift_right_round_up_if(n0: BN, n1: BN, roundUp: boolean, limit: number): BN;
    static isOverLimit(n0: BN, limit: number): boolean;
    static divRoundUp(n: BN, d: BN): BN;
    static divRoundUpIf(n: BN, d: BN, roundUp: boolean): BN;
}

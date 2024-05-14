/// <reference types="bn.js" />
import { BN } from "@coral-xyz/anchor";
import { PublicKey } from "@solana/web3.js";
/**
 * Program ID hosting Orca's Whirlpool program.
 * @category Constants
 */
export declare const ORCA_WHIRLPOOL_PROGRAM_ID: PublicKey;
/**
 * Orca's WhirlpoolsConfig PublicKey.
 * @category Constants
 */
export declare const ORCA_WHIRLPOOLS_CONFIG: PublicKey;
/**
 * Orca's supported tick spacings.
 * @category Constants
 */
export declare const ORCA_SUPPORTED_TICK_SPACINGS: number[];
/**
 * The number of rewards supported by this whirlpool.
 * @category Constants
 */
export declare const NUM_REWARDS = 3;
/**
 * The maximum tick index supported by the Whirlpool program.
 * @category Constants
 */
export declare const MAX_TICK_INDEX = 443636;
/**
 * The minimum tick index supported by the Whirlpool program.
 * @category Constants
 */
export declare const MIN_TICK_INDEX = -443636;
/**
 * The maximum sqrt-price supported by the Whirlpool program.
 * @category Constants
 */
export declare const MAX_SQRT_PRICE = "79226673515401279992447579055";
/**
 * The minimum sqrt-price supported by the Whirlpool program.
 * @category Constants
 */
export declare const MIN_SQRT_PRICE = "4295048016";
/**
 * The minimum sqrt-price supported by the Whirlpool program.
 * @category Constants
 */
export declare const MIN_SQRT_PRICE_BN: BN;
/**
 * The maximum sqrt-price supported by the Whirlpool program.
 * @category Constants
 */
export declare const MAX_SQRT_PRICE_BN: BN;
/**
 * The number of initialized ticks that a tick-array account can hold.
 * @category Constants
 */
export declare const TICK_ARRAY_SIZE = 88;
/**
 * The number of bundled positions that a position-bundle account can hold.
 * @category Constants
 */
export declare const POSITION_BUNDLE_SIZE = 256;
/**
 * @category Constants
 */
export declare const METADATA_PROGRAM_ADDRESS: PublicKey;
/**
 * The maximum number of tick-arrays that can traversed across in a swap.
 * @category Constants
 */
export declare const MAX_SWAP_TICK_ARRAYS = 3;
/**
 * The denominator which the protocol fee rate is divided on.
 * @category Constants
 */
export declare const PROTOCOL_FEE_RATE_MUL_VALUE: BN;
/**
 * The denominator which the fee rate is divided on.
 * @category Constants
 */
export declare const FEE_RATE_MUL_VALUE: BN;
/**
 * The public key that is allowed to update the metadata of Whirlpool NFTs.
 * @category Constants
 */
export declare const WHIRLPOOL_NFT_UPDATE_AUTH: PublicKey;

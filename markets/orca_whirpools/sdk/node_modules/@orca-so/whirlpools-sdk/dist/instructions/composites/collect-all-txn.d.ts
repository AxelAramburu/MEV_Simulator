import { Address } from "@coral-xyz/anchor";
import { TransactionBuilder } from "@orca-so/common-sdk";
import { PublicKey } from "@solana/web3.js";
import { PositionData, WhirlpoolContext } from "../..";
import { WhirlpoolAccountFetchOptions } from "../../network/public/fetcher";
/**
 * Parameters to collect all fees and rewards from a list of positions.
 *
 * @category Instruction Types
 * @param positionAddrs - An array of Whirlpool position addresses.
 * @param receiver - The destination wallet that collected fees & reward will be sent to. Defaults to ctx.wallet key.
 * @param positionOwner - The wallet key that contains the position token. Defaults to ctx.wallet key.
 * @param positionAuthority - The authority key that can authorize operation on the position. Defaults to ctx.wallet key.
 * @param payer - The key that will pay for the initialization of ATA token accounts. Defaults to ctx.wallet key.
 */
export type CollectAllPositionAddressParams = {
    positions: Address[];
} & CollectAllParams;
/**
 * Parameters to collect all fees and rewards from a list of positions.
 *
 * @category Instruction Types
 * @param positions - An array of Whirlpool positions.
 * @param receiver - The destination wallet that collected fees & reward will be sent to. Defaults to ctx.wallet key.
 * @param positionOwner - The wallet key that contains the position token. Defaults to ctx.wallet key.
 * @param positionAuthority - The authority key that can authorize operation on the position. Defaults to ctx.wallet key.
 * @param payer - The key that will pay for the initialization of ATA token accounts. Defaults to ctx.wallet key.
 */
export type CollectAllPositionParams = {
    positions: Record<string, PositionData>;
} & CollectAllParams;
/**
 * Common parameters between {@link CollectAllPositionParams} & {@link CollectAllPositionAddressParams}
 *
 * @category Instruction Types
 * @param receiver - The destination wallet that collected fees & reward will be sent to. Defaults to ctx.wallet key.
 * @param positionOwner - The wallet key that contains the position token. Defaults to ctx.wallet key.
 * @param positionAuthority - The authority key that can authorize operation on the position. Defaults to ctx.wallet key.
 * @param payer - The key that will pay for the initialization of ATA token accounts. Defaults to ctx.wallet key.
 */
export type CollectAllParams = {
    receiver?: PublicKey;
    positionOwner?: PublicKey;
    positionAuthority?: PublicKey;
    payer?: PublicKey;
};
/**
 * Build a set of transactions to collect fees and rewards for a set of Whirlpool Positions.
 *
 * @category Instructions
 * @experimental
 * @param ctx - WhirlpoolContext object for the current environment.
 * @param params - CollectAllPositionAddressParams object
 * @param opts an {@link WhirlpoolAccountFetchOptions} object to define fetch and cache options when accessing on-chain accounts
 * @returns A set of transaction-builders to resolve ATA for affliated tokens, collect fee & rewards for all positions.
 */
export declare function collectAllForPositionAddressesTxns(ctx: WhirlpoolContext, params: CollectAllPositionAddressParams, opts?: WhirlpoolAccountFetchOptions): Promise<TransactionBuilder[]>;
/**
 * Build a set of transactions to collect fees and rewards for a set of Whirlpool Positions.
 *
 * @experimental
 * @param ctx - WhirlpoolContext object for the current environment.
 * @param params - CollectAllPositionParams object
 * @returns A set of transaction-builders to resolve ATA for affliated tokens, collect fee & rewards for all positions.
 */
export declare function collectAllForPositionsTxns(ctx: WhirlpoolContext, params: CollectAllPositionParams): Promise<TransactionBuilder[]>;

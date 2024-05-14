import { Address } from "@orca-so/common-sdk";
import { Connection } from "@solana/web3.js";
import { WhirlpoolData } from "../../../types/public";
/**
 * Retrieve a list of whirlpool addresses and accounts filtered by the given params using
 * getProgramAccounts.
 * @category Network
 *
 * @param connection The connection to use to fetch accounts
 * @param programId The Whirlpool program to search Whirlpool accounts for
 * @param configId The {@link WhirlpoolConfig} account program address to filter by
 * @returns tuple of whirlpool addresses and accounts
 */
export declare function getAllWhirlpoolAccountsForConfig({ connection, programId, configId, }: {
    connection: Connection;
    programId: Address;
    configId: Address;
}): Promise<ReadonlyMap<string, WhirlpoolData>>;

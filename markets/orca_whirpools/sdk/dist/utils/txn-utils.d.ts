import { TransactionBuilder, TransactionBuilderOptions } from "@orca-so/common-sdk";
import { WhirlpoolContext, WhirlpoolContextOpts as WhirlpoolContextOptions } from "..";
export declare function convertListToMap<T>(fetchedData: T[], addresses: string[]): Record<string, T>;
export declare function filterNullObjects<T, K>(firstArray: ReadonlyArray<T | null>, secondArray: ReadonlyArray<K>): [Array<T>, Array<K>];
export declare function checkMergedTransactionSizeIsValid(ctx: WhirlpoolContext, builders: TransactionBuilder[], latestBlockhash: Readonly<{
    blockhash: string;
    lastValidBlockHeight: number;
}>): Promise<boolean>;
export declare function contextOptionsToBuilderOptions(opts: WhirlpoolContextOptions): TransactionBuilderOptions | undefined;

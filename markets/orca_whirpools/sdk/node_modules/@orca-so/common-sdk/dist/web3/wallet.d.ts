import { PublicKey, Transaction, VersionedTransaction } from "@solana/web3.js";
export interface Wallet {
    signTransaction<T extends Transaction | VersionedTransaction>(tx: T): Promise<T>;
    signAllTransactions<T extends Transaction | VersionedTransaction>(txs: T[]): Promise<T[]>;
    publicKey: PublicKey;
}
export declare class ReadOnlyWallet implements Wallet {
    publicKey: PublicKey;
    constructor(publicKey?: PublicKey);
    signTransaction<T extends Transaction | VersionedTransaction>(_transaction: T): Promise<T>;
    signAllTransactions<T extends Transaction | VersionedTransaction>(_transactions: T[]): Promise<T[]>;
}

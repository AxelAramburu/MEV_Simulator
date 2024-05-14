import { TokenInfo } from "..";
import { WhirlpoolAccountFetchOptions, WhirlpoolAccountFetcherInterface } from "../network/public/fetcher";
import { TokenAccountInfo, WhirlpoolData, WhirlpoolRewardInfo } from "../types/public";
export declare function getTokenMintInfos(fetcher: WhirlpoolAccountFetcherInterface, data: WhirlpoolData, opts?: WhirlpoolAccountFetchOptions): Promise<TokenInfo[]>;
export declare function getRewardInfos(fetcher: WhirlpoolAccountFetcherInterface, data: WhirlpoolData, opts?: WhirlpoolAccountFetchOptions): Promise<WhirlpoolRewardInfo[]>;
export declare function getTokenVaultAccountInfos(fetcher: WhirlpoolAccountFetcherInterface, data: WhirlpoolData, opts?: WhirlpoolAccountFetchOptions): Promise<TokenAccountInfo[]>;

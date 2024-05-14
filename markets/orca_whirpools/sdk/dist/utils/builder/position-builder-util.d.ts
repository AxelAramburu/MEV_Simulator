import { WhirlpoolContext } from "../..";
import { WhirlpoolAccountFetchOptions } from "../../network/public/fetcher";
import { PositionData, WhirlpoolData } from "../../types/public";
export declare function getTickArrayDataForPosition(ctx: WhirlpoolContext, position: PositionData, whirlpool: WhirlpoolData, opts?: WhirlpoolAccountFetchOptions): Promise<readonly (import("../..").TickArrayData | null)[]>;

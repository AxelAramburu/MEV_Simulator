import { Percentage, TransactionBuilder } from "@orca-so/common-sdk";
import { Account } from "@solana/spl-token";
import { WhirlpoolContext } from "..";
import { WhirlpoolAccountFetchOptions } from "../network/public/fetcher";
import { PoolGraph } from "../utils/public";
import { ExecutableRoute, RouteSelectOptions, RoutingOptions, Trade, TradeRoute, WhirlpoolRouter } from "./public";
export declare class WhirlpoolRouterImpl implements WhirlpoolRouter {
    readonly ctx: WhirlpoolContext;
    readonly poolGraph: PoolGraph;
    constructor(ctx: WhirlpoolContext, poolGraph: PoolGraph);
    findAllRoutes(trade: Trade, opts?: Partial<RoutingOptions>, fetchOpts?: WhirlpoolAccountFetchOptions): Promise<TradeRoute[]>;
    findBestRoute(trade: Trade, routingOpts?: Partial<RoutingOptions>, selectionOpts?: Partial<RouteSelectOptions>, fetchOpts?: WhirlpoolAccountFetchOptions): Promise<ExecutableRoute | null>;
    swap(trade: TradeRoute, slippage: Percentage, resolvedAtas: Account[] | null): Promise<TransactionBuilder>;
}

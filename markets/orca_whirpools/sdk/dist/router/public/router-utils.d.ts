import { TransactionBuilder } from "@orca-so/common-sdk";
import { Account } from "@solana/spl-token";
import { PublicKey } from "@solana/web3.js";
import Decimal from "decimal.js";
import { ExecutableRoute, RoutingOptions, Trade, TradeRoute } from ".";
import { WhirlpoolContext } from "../../context";
/**
 * A type representing a Associated Token Account
 * @param address The address of the ATA account.
 * @param owner The owner address of the ATA.
 * @param mint The mint of the token the ATA represents.
 */
export type AtaAccountInfo = Pick<Account, "address" | "owner" | "mint">;
/**
 * Parameters to configure the selection of the best route.
 * @category Router
 * @param maxSupportedTransactionVersion The maximum transaction version that the wallet supports.
 * @param maxTransactionSize The maximum transaction size that the wallet supports.
 * @param availableAtaAccounts A list of ATA accounts that are available in this wallet to use for the swap.
 * @param onRouteEvaluation
 * A callback that is called right before a route is evaluated. Users have a chance to add additional instructions
 * to be added for an accurate txn size measurement. (ex. Adding a priority fee ix to the transaction)
 *
 */
export type RouteSelectOptions = {
    maxSupportedTransactionVersion: "legacy" | number;
    maxTransactionSize: number;
    availableAtaAccounts?: AtaAccountInfo[];
    onRouteEvaluation?: (route: Readonly<TradeRoute>, tx: TransactionBuilder) => void;
};
/**
 * A selection of utility functions for the {@link WhirlpoolRouter}.
 * @category Router
 */
export declare class RouterUtils {
    /**
     * Selects the best executable route from a list of routes using the current execution environment.
     * The wallet support type, available ATA accounts, existance of lookup tables all effect the transaction size
     * and eligibility of a route.
     *
     * @param ctx The {@link WhirlpoolContext} that represents the current execution environment
     * @param orderedRoutes A list of routes to select from, ordered by the best routes (trade amount wise) first.
     * @param opts {@link RouteSelectOptions} to configure the selection of the best route.
     * @returns
     * The best {@link ExecutableRoute} that can be used to execute a swap. If no executable route is found, null is returned.
     */
    static selectFirstExecutableRoute(ctx: WhirlpoolContext, orderedRoutes: TradeRoute[], opts: RouteSelectOptions): Promise<ExecutableRoute | null>;
    /**
     * Calculate the price impact for a route.
     * @param trade The trade the user used to derive the route.
     * @param route The route to calculate the price impact for.
     * @returns A Decimal object representing the percentage value of the price impact (ex. 3.01%)
     */
    static getPriceImpactForRoute(trade: Trade, route: TradeRoute): Decimal;
    /**
     * Get the tick arrays addresses that are touched by a route.
     * @param route The route to get the tick arrays from.
     * @returns The tick arrays addresses that are touched by the route.
     */
    static getTouchedTickArraysFromRoute(route: TradeRoute): PublicKey[];
    /**
     * Get the default options for generating trade routes.
     * @returns Default options for generating trade routes.
     */
    static getDefaultRouteOptions(): RoutingOptions;
    /**
     * Get the default options for selecting a route from a list of generated routes.
     * @returns Default options for selecting a a route from a list of generated routes.
     */
    static getDefaultSelectOptions(): RouteSelectOptions;
}

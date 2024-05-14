import { Address } from "@coral-xyz/anchor";
import { DecimalsMap, PoolMap, PriceCalculationData, PriceMap, TickArrayMap } from ".";
import { WhirlpoolAccountFetchOptions, WhirlpoolAccountFetcherInterface } from "../network/public/fetcher";
/**
 * PriceModule is a static class that provides functions for fetching and calculating
 * token prices for a set of pools or mints.
 *
 * @category PriceModule
 */
export declare class PriceModule {
    /**
     * Fetches and calculates the prices for a set of tokens.
     * This method will derive the pools that need to be queried from the mints and is not performant.
     *
     * @param fetcher {@link WhirlpoolAccountFetcherInterface}
     * @param mints The mints to fetch prices for.
     * @param config The configuration for the price calculation.
     * @param thresholdConfig - The threshold configuration for the price calculation.
     * @param opts an {@link WhirlpoolAccountFetchOptions} object to define fetch and cache options when accessing on-chain accounts
     * @param availableData - Data that is already available to avoid redundant fetches.
     * @returns A map of token addresses to prices.
     */
    static fetchTokenPricesByMints(fetcher: WhirlpoolAccountFetcherInterface, mints: Address[], config?: import(".").GetPricesConfig, thresholdConfig?: import(".").GetPricesThresholdConfig, opts?: import("@orca-so/common-sdk").SimpleAccountFetchOptions, availableData?: Partial<PriceCalculationData>): Promise<PriceMap>;
    /**
     * Fetches and calculates the token prices from a set of pools.
     *
     * @param fetcher {@link WhirlpoolAccountFetcherInterface}
     * @param pools The pools to fetch prices for.
     * @param config The configuration for the price calculation.
     * @param thresholdConfig The threshold configuration for the price calculation.
     * @param opts an {@link WhirlpoolAccountFetchOptions} object to define fetch and cache options when accessing on-chain accounts
     * @returns A map of token addresses to prices
     */
    static fetchTokenPricesByPools(fetcher: WhirlpoolAccountFetcherInterface, pools: Address[], config?: import(".").GetPricesConfig, thresholdConfig?: import(".").GetPricesThresholdConfig, opts?: WhirlpoolAccountFetchOptions): Promise<PriceMap>;
    /**
     * Calculate the price of each token in the mints array.
     *
     * Each token will be priced against the first quote token in the config.quoteTokens array
     * with sufficient liquidity. If a token does not have sufficient liquidity against the
     * first quote token, then it will be priced against the next quote token in the array.
     * If a token does not have sufficient liquidity against any quote token,
     * then the price will be set to null.
     *
     * @category PriceModule
     * @param mints The mints to calculate prices for.
     * @param priceCalcData The data required to calculate prices.
     * @param config The configuration for the price calculation.
     * @param thresholdConfig The threshold configuration for the price calculation.
     * @returns A map of token addresses to prices.
     */
    static calculateTokenPrices(mints: Address[], priceCalcData: PriceCalculationData, config?: import(".").GetPricesConfig, thresholdConfig?: import(".").GetPricesThresholdConfig): PriceMap;
}
/**
 * A list of utility functions for the price module.
 * @category PriceModule
 */
export declare class PriceModuleUtils {
    /**
     * Fetch pool data for the given mints by deriving the PDA from all combinations of mints & tick-arrays.
     * Note that this method can be slow.
     *
     * @param fetcher {@link WhirlpoolAccountFetcherInterface}
     * @param mints The mints to fetch pool data for.
     * @param config The configuration for the price calculation.
     * @param opts an {@link WhirlpoolAccountFetchOptions} object to define fetch and cache options when accessing on-chain accounts
     * @returns A {@link PoolMap} of pool addresses to pool data.
     */
    static fetchPoolDataFromMints(fetcher: WhirlpoolAccountFetcherInterface, mints: Address[], config?: import(".").GetPricesConfig, opts?: import("@orca-so/common-sdk").SimpleAccountFetchOptions): Promise<PoolMap>;
    /**
     * Fetch tick-array data for the given pools
     *
     * @param fetcher {@link WhirlpoolAccountFetcherInterface}
     * @param pools The pools to fetch tick-array data for.
     * @param config The configuration for the price calculation.
     * @param opts an {@link WhirlpoolAccountFetchOptions} object to define fetch and cache options when accessing on-chain accounts
     * @returns A {@link TickArrayMap} of tick-array addresses to tick-array data.
     */
    static fetchTickArraysForPools(fetcher: WhirlpoolAccountFetcherInterface, pools: PoolMap, config?: import(".").GetPricesConfig, opts?: WhirlpoolAccountFetchOptions): Promise<TickArrayMap>;
    /**
     * Fetch the decimals to token mapping for the given mints.
     * @param fetcher {@link WhirlpoolAccountFetcherInterface}
     * @param mints The mints to fetch decimals for.
     * @param opts an {@link WhirlpoolAccountFetchOptions} object to define fetch and cache options when accessing on-chain accounts
     * @returns A {@link DecimalsMap} of mint addresses to decimals.
     */
    static fetchDecimalsForMints(fetcher: WhirlpoolAccountFetcherInterface, mints: Address[], opts?: import("@orca-so/common-sdk").SimpleAccountFetchOptions): Promise<DecimalsMap>;
}

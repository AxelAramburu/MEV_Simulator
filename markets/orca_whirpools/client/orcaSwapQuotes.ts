import { PublicKey } from "@solana/web3.js";
import { AnchorProvider } from "@coral-xyz/anchor";
import { DecimalUtil, Percentage } from "@orca-so/common-sdk";
import {
  WhirlpoolContext, buildWhirlpoolClient, ORCA_WHIRLPOOL_PROGRAM_ID,
  PDAUtil, swapQuoteByInputToken, IGNORE_CACHE
} from "@orca-so/whirlpools-sdk";
import { Amounts, InputInfos } from "./types";
import Decimal from "decimal.js";

// Environment variables must be defined before script execution

export const swapQuote = async (inputInfos: InputInfos):Promise<Amounts>  =>  {
  console.log("ORCA WHIRPOOLS Simulation");
  try {
    // Create WhirlpoolClient
    const provider = AnchorProvider.env();
    const ctx = WhirlpoolContext.withProvider(provider, ORCA_WHIRLPOOL_PROGRAM_ID);
    const client = buildWhirlpoolClient(ctx);


    // Token definition
    const token0 = {mint: new PublicKey(inputInfos.tokenInKey), decimals: inputInfos.tokenInDecimals}; //Sol
    const token1 = {mint: new PublicKey(inputInfos.tokenOutKey), decimals: inputInfos.tokenOutDecimals}; //WIF

    // WhirlpoolsConfig account Mainet
    const WHIRLPOOLS_CONFIG = new PublicKey("2LecshUwdy9xi7meFgHtFJQNSKk4KdTrcpvaB56dP2NQ");

    // Get token1/token0 whirlpool
    // Whirlpools are identified by 5 elements (Program, Config, mint address of the 1st token,
    // mint address of the 2nd token, tick spacing), similar to the 5 column compound primary key in DB
    const tick_spacing = inputInfos.tickSpacing;

    // const whirlpool_pubkey = PDAUtil.getWhirlpool(
    //     ORCA_WHIRLPOOL_PROGRAM_ID,
    //     WHIRLPOOLS_CONFIG,
    //     token0.mint, token1.mint, tick_spacing).publicKey;
    // console.log("whirlpool_key:", whirlpool_pubkey.toBase58());

    const whirlpool = await client.getPool(inputInfos.pool_id);
    
    const amountInDecimals = +inputInfos.amountIn / Math.pow(10, inputInfos.tokenInDecimals);    
    let amount_in = new Decimal(amountInDecimals);    

    // Obtain swap estimation (run simulation)
    const quote = await swapQuoteByInputToken(
      whirlpool,
      // Input token and amount
      token0.mint,
      DecimalUtil.toBN(amount_in, token0.decimals),
      // Acceptable slippage (10/1000 = 1%)
      Percentage.fromFraction(10, 1000),
      ctx.program.programId,
      ctx.fetcher,
      IGNORE_CACHE,
    );
    
    // Output the estimation
    let estimatedAmountIn = DecimalUtil.fromBN(quote.estimatedAmountIn, 0);
    let estimatedAmountOut = DecimalUtil.fromBN(quote.estimatedAmountOut, 0);
    let estimatedMinAmountOut = DecimalUtil.fromBN(quote.otherAmountThreshold, 0);
    console.log("🟢🟢 Done - ORCA WHIRPOOLS");
    console.log("estimatedAmountIn:", estimatedAmountIn, inputInfos.tokenInSymbol);
    console.log("estimatedAmountOut:", estimatedAmountOut, inputInfos.tokenOutSymbol);
    console.log("estimatedMinAmountOut:", estimatedMinAmountOut, inputInfos.tokenOutSymbol);
    
    let result: Amounts = {
      amountIn: estimatedAmountIn.toString(),
      estimatedAmountOut: estimatedAmountOut.toString(),
      estimatedMinAmountOut: estimatedMinAmountOut.toString(),
    }

    return result;
  } catch (error) {
    console.error(error);
    throw(error);
  }
}
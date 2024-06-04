import { BN } from "@coral-xyz/anchor";
import { InputInfos, InputInfosMeteora } from "../../orca_whirpools/client/types";
import DLMM from '@meteora-ag/dlmm'
import { Connection, PublicKey } from "@solana/web3.js";


export async function quoteSwapMeteora(inputInfos: InputInfosMeteora) {

    const connection = new Connection(process.env.ANCHOR_PROVIDER_URL);

    const pool = new PublicKey(inputInfos.pool_id);
    const dlmmPool = await DLMM.create(connection, pool);

    const swapAmount = new BN(inputInfos.amountIn);
    const swapYtoX = inputInfos.token0to1;

    const binArrays = await dlmmPool.getBinArrayForSwap(swapYtoX);


    const swapQuote = await dlmmPool.swapQuote(
        swapAmount,
        swapYtoX,
        new BN(10),
        binArrays
    );

    let consumedInAmount = swapQuote.consumedInAmount.toString();
    let estimatedAmountOut = swapQuote.outAmount.toString();
    let estimatedMinAmountOut = swapQuote.minOutAmount.toString();
    
    console.log("🟢🟢 Done - METEORA");
    console.log("estimatedAmountIn:", consumedInAmount, inputInfos.tokenInSymbol);
    console.log("estimatedAmountOut:", estimatedAmountOut, inputInfos.tokenOutSymbol);
    console.log("estimatedMinAmountOut:", estimatedMinAmountOut, inputInfos.tokenOutSymbol);

    return ({consumedInAmount: consumedInAmount, amountOut: estimatedAmountOut, minAmountOut: estimatedMinAmountOut});

}


// export interface SwapQuote {
//     consumedInAmount: BN;
//     outAmount: BN;
//     fee: BN;
//     protocolFee: BN;
//     minOutAmount: BN;
//     priceImpact: Decimal;
//     binArraysPubkey: any[];
//   }
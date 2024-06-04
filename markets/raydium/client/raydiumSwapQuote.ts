import {
  jsonInfo2PoolKeys,
  Liquidity,
  LiquidityPoolKeys,
  // Percent,
  // Token,
  // TokenAmount,
} from '@raydium-io/raydium-sdk';
// import { Keypair } from '@solana/web3.js';

import {
  connection,
  // DEFAULT_TOKEN,
  // makeTxVersion,
  // wallet
} from './config';
import { formatAmmKeysById } from './formatAmmKeysById';
import {
  // buildAndSendTx,
  // getWalletTokenAccount,
} from './util';
import assert = require('assert');
import { InputInfos } from './types';

// type WalletTokenAccounts = Awaited<ReturnType<typeof getWalletTokenAccount>>
// type TestTxInputInfo = {
//   outputToken: Token
//   targetPool: string
//   inputTokenAmount: TokenAmount
//   slippage: Percent
//   walletTokenAccounts: WalletTokenAccounts
//   wallet: Keypair
// }

export async function quoteSwapOnlyAmm(inputInfos: InputInfos) {
  console.log("RAYDIUM Simulation");
  // -------- pre-action: get pool info --------
  
  const targetPoolInfo = await formatAmmKeysById(inputInfos.targetPool)

  assert(targetPoolInfo, 'cannot find the target pool')
  const poolKeys = jsonInfo2PoolKeys(targetPoolInfo) as LiquidityPoolKeys
  
  // -------- step 1: coumpute amount out --------
  const { amountOut, minAmountOut } = Liquidity.computeAmountOut({
    // eslint-disable-next-line object-shorthand
    poolKeys: poolKeys,
    poolInfo: await Liquidity.fetchInfo({ connection, poolKeys }),
    amountIn: inputInfos.inputTokenAmount,
    currencyOut: inputInfos.outputToken,
    slippage: inputInfos.slippage,
  })
  // let str = JSON.stringify(inputInfos);
  // console.log(str);
  // let str2 = JSON.stringify(amountOut);
  // console.log(str2);
  // let str3 = JSON.stringify(minAmountOut);
  // console.log(str3);

  let estimatedAmountIn = inputInfos.inputTokenAmount.numerator.toString();
  let estimatedAmountOut = amountOut.numerator.toString();
  let estimatedMinAmountOut = minAmountOut.numerator.toString();
  console.log("🟢🟢 Done - RAYDIUM");
  console.log("estimatedAmountIn:", estimatedAmountIn, inputInfos.symbolTokenIn);
  console.log("estimatedAmountOut:", estimatedAmountOut, inputInfos.symbolTokenOut);
  console.log("estimatedMinAmountOut:", estimatedMinAmountOut, inputInfos.symbolTokenOut);

  return ({amountOut: estimatedAmountOut, minAmountOut: estimatedMinAmountOut});

}
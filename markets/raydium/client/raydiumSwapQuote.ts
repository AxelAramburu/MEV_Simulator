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

  let estimatedAmountIn = inputInfos.inputTokenAmount.toFixed().toString();
  let estimatedAmountOut = amountOut.toFixed().toString();
  let estimatedMinAmountOut = minAmountOut.toFixed().toString();
  console.log("🟢🟢 Done");
  console.log("estimatedAmountIn:", estimatedAmountIn, "token0");
  console.log("estimatedAmountOut:", estimatedAmountOut, "token1");
  console.log("estimatedMinAmountOut:", estimatedMinAmountOut, "token1");

  return ({amountOut: amountOut.toFixed(), minAmountOut: minAmountOut.toFixed()});

  // -------- step 2: create instructions by SDK function --------
  // const { innerTransactions } = await Liquidity.makeSwapInstructionSimple({
  //   connection,
  //   poolKeys,
  //   userKeys: {
  //     tokenAccounts: input.walletTokenAccounts,
  //     owner: input.wallet.publicKey,
  //   },
  //   amountIn: input.inputTokenAmount,
  //   amountOut: minAmountOut,
  //   fixedSide: 'in',
  //   makeTxVersion,
  // })

  console.log('amountOut:', amountOut.toFixed(), '  minAmountOut: ', minAmountOut.toFixed())

  // return { txids: await buildAndSendTx(innerTransactions) }
}

// async function howToUse() {
//   const inputToken = DEFAULT_TOKEN.USDC // USDC
//   const outputToken = DEFAULT_TOKEN.RAY // RAY
//   const targetPool = 'pool id' // USDC-RAY pool
//   const inputTokenAmount = new TokenAmount(inputToken, 10000)
//   const slippage = new Percent(1, 100)
//   const walletTokenAccounts = await getWalletTokenAccount(connection, wallet.publicKey)

//   swapOnlyAmm({
//     outputToken,
//     targetPool,
//     inputTokenAmount,
//     slippage,
//     walletTokenAccounts,
//     wallet: wallet,
//   }).then(({ txids }) => {
//     /** continue with txids */
//     console.log('txids', txids)
//   })
// }
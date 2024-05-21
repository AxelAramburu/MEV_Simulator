import {
    Percent,
    Token,
    TokenAmount,
} from '@raydium-io/raydium-sdk';
// import {
    // buildAndSendTx,
    // getWalletTokenAccount,
// } from './util';
// import { Keypair } from '@solana/web3.js';

// type WalletTokenAccounts = Awaited<ReturnType<typeof getWalletTokenAccount>>

export type InputInfos = {
    outputToken: Token
    targetPool: string
    inputTokenAmount: TokenAmount
    slippage: Percent
  }
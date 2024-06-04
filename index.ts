import { Connection } from '@solana/web3.js';
import { Address, AddressUtil } from "@orca-so/common-sdk";

import { swapQuote } from "./markets/orca_whirpools/sdk/client/orcaSwapQuotes";
import { InputInfosMeteora, InputInfos as OrcaInputInfos } from "./markets/orca_whirpools/sdk/client/types";
import { InputInfos as RaydiumInputInfos } from "./markets/raydium/client/types";

import { quoteSwapOnlyAmm } from "./markets/raydium/client/raydiumSwapQuote";
import { BigNumberish, Percent, Token, TokenAmount } from '@raydium-io/raydium-sdk';
import { getAllWhirlpoolAccountsForConfig } from './markets/orca_whirpools/sdk/src/network/public/fetcher/fetcher-utils';
import { quoteSwapMeteora } from './markets/meteora/client/meteoraSwapQuote';
import { SwapQuote } from './markets/meteora/dlmm-sdk/ts-client/src/dlmm/types';

const { createServer, http } = require("http");
const { Server } = require("socket.io");
const app = require('./app');

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*", // Allow all origins. Adjust as needed for security.
    methods: ["GET", "POST"]
  }
});
io.on("connection", (socket) => {
  console.log("new socket connected");
  socket.on('orca_quote', async (json) => {
    console.log(json.poolId); 
    console.log(json.amountIn); 
    console.log(json.tokenInKey); 
    console.log(json.tokenOutKey); 

    try {
      let inputParams: OrcaInputInfos = {
        pool_id: json.poolId,
        tokenInKey: json.tokenInKey,
        tokenInDecimals: json.tokenInDecimals,
        tokenInSymbol: json.tokenInSymbol,
        tokenOutKey: json.tokenOutKey,
        tokenOutDecimals: json.tokenOutDecimals,
        tokenOutSymbol: json.tokenOutSymbol,
        tickSpacing: json.tickSpacing,
        amountIn: json.amountIn,
      }
      let result = await swapQuote(inputParams);
      
      socket.emit('orca_quote_res', {
        amountIn: result.amountIn,
        estimatedAmountOut: result.estimatedAmountOut,
        estimatedMinAmountOut: result.estimatedMinAmountOut,
      });

    } catch (error) {
      console.log("🔴🔴 Error in Orca Simulation");
      console.log(error);
      socket.emit('orca_quote_res', {
        amountIn: error,
        estimatedAmountOut: error,
        estimatedMinAmountOut: error,
      });
    }
  });
  socket.on("disconnect", (reason) => {
      console.log(`Socket disconnected due to ${reason}`);
  });
  socket.on("error", (error) => {
      console.log(`Socket error: ${error}`);
  });
});
//Add this line
app.set("socket", io);

const normalizePort = (val: any) => {
  const port = parseInt(val, 10);
  
    if (isNaN(port)) {
      return val;
    }
    if (port >= 0) {
      return port;
    }
    return false;
  };

const port = normalizePort(process.env.PORT || '3000');
app.set('port', port);
  
httpServer.listen(port);

const errorHandler = (error: any) => {
    if (error.syscall !== 'listen') {
      throw error;
    }
    const address = httpServer.address();
    const bind = typeof address === 'string' ? 'pipe ' + address : 'port: ' + port;
    switch (error.code) {
      case 'EACCES':
        console.error(bind + ' requires elevated privileges.');
        process.exit(1);
        break;
      case 'EADDRINUSE':
        console.error(bind + ' is already in use.');
        process.exit(1);
        break;
      default:
        throw error;
    }
  };

httpServer.on('error', errorHandler);
httpServer.on('listening', () => {
  const address = httpServer.address();
  const bind = typeof address === 'string' ? 'pipe ' + address : 'port ' + port;
  console.log('✅ Listening on ' + bind);
});

// app.use((request: any, response: any) => {
//     response.json({ message: 'Hey! This is your server response baby!' }); 
//   });  

app.get('/orca_quote', async function (req: any, res: any) {
  let url: string = req.originalUrl;
  console.log(url);
  console.log("Pool address = ", req.query.poolId);
  //Exemple URL: http://localhost:3000/orca_quote?poolId=EzCFMMo43qLLkYQqhLG8Kjj4UL3Dwvk2paf7yqB575KP&tokenInKey=So11111111111111111111111111111111111111112&tokenInDecimals=9&tokenOutKey=JUPyiwrYJFskUPiHa7hkeR8VUtAeFoSYbKedZNsDvCN&tokenOutDecimals=6&tickSpacing=8&amountIn=1
  
  try {
    let inputParams: OrcaInputInfos = {
      pool_id: req.query.poolId,
      tokenInKey: req.query.tokenInKey,
      tokenInDecimals: req.query.tokenInDecimals,
      tokenOutSymbol: req.query.tokenOutSymbol,
      tokenOutKey: req.query.tokenOutKey,
      tokenOutDecimals: req.query.tokenOutDecimals,
      tokenInSymbol: req.query.tokenInSymbol,
      tickSpacing: req.query.tickSpacing,
      amountIn: req.query.amountIn,
    }
    let result = await swapQuote(inputParams);
    res.json({
      amountIn: result.amountIn,
      estimatedAmountOut: result.estimatedAmountOut,
      estimatedMinAmountOut: result.estimatedMinAmountOut,
    });
    console.log("------------------------------------------------------------------------------------------------------------------------------");
  } catch (error) {
    console.log("🔴🔴 Error in Orca Simulation");
    res.json({
      error: error.toString(),
    });
    console.log("------------------------------------------------------------------------------------------------------------------------------");
  }
});

app.get('/raydium_quote', async function (req: any, res: any) {
  let url: string = req.originalUrl;
  console.log(url);
  console.log("Pool address = ", req.query.poolKeys);
  //Exemple URL: http://localhost:3000/raydium_quote?poolKeys=58oQChx4yWmvKdwLLZzBi4ChoCc2fqCUWBkwMihLYQo2&amountIn=1000000&currencyIn=So11111111111111111111111111111111111111112&decimalsIn=9&currencyOut=EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v&decimalsOut=6

  try {
    let inputToken: Token = new Token(
      "675kPX9MHTjS2zt1qfr1NYHuzeLXfQM9H24wFSUt1Mp8", //Raydium Program Id
      req.query.currencyIn,
      Number(req.query.decimalsIn),
    );
    
    let outputToken: Token = new Token(
      "675kPX9MHTjS2zt1qfr1NYHuzeLXfQM9H24wFSUt1Mp8", //Raydium Program Id
      req.query.currencyOut,
      Number(req.query.decimalsOut),
    );
  
    // let amountInAtDecimals = Number(req.query.amountIn) * Math.pow(10, Number(req.query.decimalsIn));
  
    let tokenAmount: TokenAmount = new TokenAmount(
      inputToken,
      req.query.amountIn
    );
    
    let slippage: Percent = new Percent(1, 100); //1% Slippage
    
    let inputParams: RaydiumInputInfos = {
      outputToken: outputToken,
      targetPool: req.query.poolKeys,
      inputTokenAmount: tokenAmount,
      slippage: slippage,
      symbolTokenIn: req.query.symbolTokenIn,
      symbolTokenOut: req.query.symbolTokenOut,
    }
    let result = await quoteSwapOnlyAmm(inputParams);
    res.json({
      amountIn: req.query.amountIn,
      estimatedAmountOut: result.amountOut,
      estimatedMinAmountOut: result.minAmountOut
    });
    console.log("------------------------------------------------------------------------------------------------------------------------------");

  } catch (error) {
    console.log("🔴🔴 Error in Raydium Simulation");
    console.log(error);
    res.json({
      error: error.toString(),
    });
    console.log("------------------------------------------------------------------------------------------------------------------------------");
  }
});

app.get('/meteora_quote', async function (req: any, res: any) {

  //Exemple URL: http://localhost:3000/meteora_quote?poolId=9H7BB44QhZs6H4GP8XvW7Kq1b9PnDC5UAyaPoqYHoV9f&token0to1=true&amountIn=207139234106450&tokenInSymbol=GME&tokenOutSymbol=SOL
  try {
    let url: string = req.originalUrl;
    console.log(url);
    console.log("Pool address = ", req.query.poolId);

    if (req.query.token0to1 != "true" && req.query.token0to1 != "false") {
      throw new Error("Bad boolean on Meteora request");
    }
    let inputParams: InputInfosMeteora = {
      pool_id: req.query.poolId,
      token0to1: req.query.token0to1 == "true" ? true : false,
      amountIn: req.query.amountIn,
      tokenInSymbol: req.query.tokenInSymbol,
      tokenOutSymbol: req.query.tokenOutSymbol,
    }    
    let result = await quoteSwapMeteora(inputParams);
    res.json({
      amountIn: result.consumedInAmount,
      estimatedAmountOut: result.amountOut,
      estimatedMinAmountOut: result.minAmountOut
    });
    console.log("------------------------------------------------------------------------------------------------------------------------------");
  } catch (error) {
    console.log("🔴🔴 Error in Meteora Simulation");
    console.log(error);
    res.json({
      error: error.toString(),
    });
    console.log("------------------------------------------------------------------------------------------------------------------------------");
  }

});

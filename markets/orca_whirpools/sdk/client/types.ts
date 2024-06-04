export interface InputInfos {
    pool_id: string;
    tokenInKey: string;
    tokenInDecimals: number;
    tokenInSymbol: string;
    tokenOutKey: string;
    tokenOutDecimals: number;
    tokenOutSymbol: string;
    tickSpacing: number;
    amountIn: string;
}
export interface InputInfosMeteora {
    pool_id: string;
    token0to1: boolean
    amountIn: string;
    tokenInSymbol: string;
    tokenOutSymbol: string;
}
  
export interface Amounts {
    amountIn: string;
    estimatedAmountOut: string;
    estimatedMinAmountOut: string;
}
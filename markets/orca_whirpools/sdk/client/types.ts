export interface InputInfos {
    pool_id: string;
    tokenInKey: string;
    tokenInDecimals: number;
    tokenOutKey: string;
    tokenOutDecimals: number;
    tickSpacing: number;
    amountIn: string;
}
  
export interface Amounts {
    amountIn: string;
    estimatedAmountOut: string;
    estimatedMinAmountOut: string;
}
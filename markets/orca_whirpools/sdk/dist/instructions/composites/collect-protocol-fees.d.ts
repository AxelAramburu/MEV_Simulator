import { Address } from "@coral-xyz/anchor";
import { TransactionBuilder } from "@orca-so/common-sdk";
import { WhirlpoolContext } from "../..";
export declare function collectProtocolFees(ctx: WhirlpoolContext, poolAddresses: Address[]): Promise<TransactionBuilder>;

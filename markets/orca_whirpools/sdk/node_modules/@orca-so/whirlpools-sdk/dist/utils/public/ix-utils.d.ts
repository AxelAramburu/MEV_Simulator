import { Instruction, TransactionBuilder } from "@orca-so/common-sdk";
import { WhirlpoolContext } from "../../context";
export declare function toTx(ctx: WhirlpoolContext, ix: Instruction): TransactionBuilder;

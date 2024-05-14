"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.collectRewardsQuote = void 0;
const anchor_1 = require("@coral-xyz/anchor");
const common_sdk_1 = require("@orca-so/common-sdk");
const tiny_invariant_1 = __importDefault(require("tiny-invariant"));
const public_1 = require("../../types/public");
const bit_math_1 = require("../../utils/math/bit-math");
const pool_utils_1 = require("../../utils/public/pool-utils");
/**
 * Get a quote on the outstanding rewards owed to a position.
 *
 * @category Quotes
 * @param param A collection of fetched Whirlpool accounts to faciliate the quote.
 * @returns A quote object containing the rewards owed for each reward in the pool.
 */
function collectRewardsQuote(param) {
    const { whirlpool, position, tickLower, tickUpper, timeStampInSeconds } = param;
    const { tickCurrentIndex, rewardInfos: whirlpoolRewardsInfos, rewardLastUpdatedTimestamp, } = whirlpool;
    const { tickLowerIndex, tickUpperIndex, liquidity, rewardInfos: positionRewardInfos } = position;
    const currTimestampInSeconds = timeStampInSeconds ?? new anchor_1.BN(Date.now()).div(new anchor_1.BN(1000));
    const timestampDelta = currTimestampInSeconds.sub(new anchor_1.BN(rewardLastUpdatedTimestamp));
    const rewardOwed = [undefined, undefined, undefined];
    for (let i = 0; i < public_1.NUM_REWARDS; i++) {
        // Calculate the reward growth on the outside of the position (growth_above, growth_below)
        const rewardInfo = whirlpoolRewardsInfos[i];
        const positionRewardInfo = positionRewardInfos[i];
        (0, tiny_invariant_1.default)(!!rewardInfo, "whirlpoolRewardsInfos cannot be undefined");
        const isRewardInitialized = pool_utils_1.PoolUtil.isRewardInitialized(rewardInfo);
        if (!isRewardInitialized) {
            continue;
        }
        // Increment the global reward growth tracker based on time elasped since the last whirlpool update.
        let adjustedRewardGrowthGlobalX64 = rewardInfo.growthGlobalX64;
        if (!whirlpool.liquidity.isZero()) {
            const rewardGrowthDelta = bit_math_1.BitMath.mulDiv(timestampDelta, rewardInfo.emissionsPerSecondX64, whirlpool.liquidity, 128);
            adjustedRewardGrowthGlobalX64 = rewardInfo.growthGlobalX64.add(rewardGrowthDelta);
        }
        // Calculate the reward growth outside of the position
        const tickLowerRewardGrowthsOutsideX64 = tickLower.rewardGrowthsOutside[i];
        const tickUpperRewardGrowthsOutsideX64 = tickUpper.rewardGrowthsOutside[i];
        let rewardGrowthsBelowX64 = adjustedRewardGrowthGlobalX64;
        if (tickLower.initialized) {
            rewardGrowthsBelowX64 =
                tickCurrentIndex < tickLowerIndex
                    ? common_sdk_1.MathUtil.subUnderflowU128(adjustedRewardGrowthGlobalX64, tickLowerRewardGrowthsOutsideX64)
                    : tickLowerRewardGrowthsOutsideX64;
        }
        let rewardGrowthsAboveX64 = new anchor_1.BN(0);
        if (tickUpper.initialized) {
            rewardGrowthsAboveX64 =
                tickCurrentIndex < tickUpperIndex
                    ? tickUpperRewardGrowthsOutsideX64
                    : common_sdk_1.MathUtil.subUnderflowU128(adjustedRewardGrowthGlobalX64, tickUpperRewardGrowthsOutsideX64);
        }
        const rewardGrowthInsideX64 = common_sdk_1.MathUtil.subUnderflowU128(common_sdk_1.MathUtil.subUnderflowU128(adjustedRewardGrowthGlobalX64, rewardGrowthsBelowX64), rewardGrowthsAboveX64);
        // Knowing the growth of the reward checkpoint for the position, calculate and increment the amount owed for each reward.
        const amountOwedX64 = positionRewardInfo.amountOwed.shln(64);
        rewardOwed[i] = amountOwedX64
            .add(common_sdk_1.MathUtil.subUnderflowU128(rewardGrowthInsideX64, positionRewardInfo.growthInsideCheckpoint).mul(liquidity))
            .shrn(64);
    }
    return rewardOwed;
}
exports.collectRewardsQuote = collectRewardsQuote;

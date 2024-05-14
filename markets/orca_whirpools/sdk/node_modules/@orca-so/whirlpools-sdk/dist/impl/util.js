"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTokenVaultAccountInfos = exports.getRewardInfos = exports.getTokenMintInfos = void 0;
const bn_js_1 = __importDefault(require("bn.js"));
const __1 = require("..");
async function getTokenMintInfos(fetcher, data, opts) {
    const mintA = data.tokenMintA;
    const infoA = await fetcher.getMintInfo(mintA, opts);
    if (!infoA) {
        throw new Error(`Unable to fetch MintInfo for mint - ${mintA}`);
    }
    const mintB = data.tokenMintB;
    const infoB = await fetcher.getMintInfo(mintB, opts);
    if (!infoB) {
        throw new Error(`Unable to fetch MintInfo for mint - ${mintB}`);
    }
    return [
        { mint: mintA, ...infoA },
        { mint: mintB, ...infoB },
    ];
}
exports.getTokenMintInfos = getTokenMintInfos;
async function getRewardInfos(fetcher, data, opts) {
    const rewardInfos = [];
    for (const rewardInfo of data.rewardInfos) {
        rewardInfos.push(await getRewardInfo(fetcher, rewardInfo, opts));
    }
    return rewardInfos;
}
exports.getRewardInfos = getRewardInfos;
async function getRewardInfo(fetcher, data, opts) {
    const rewardInfo = { ...data, initialized: false, vaultAmount: new bn_js_1.default(0) };
    if (__1.PoolUtil.isRewardInitialized(data)) {
        const vaultInfo = await fetcher.getTokenInfo(data.vault, opts);
        if (!vaultInfo) {
            throw new Error(`Unable to fetch TokenAccountInfo for vault - ${data.vault}`);
        }
        rewardInfo.initialized = true;
        rewardInfo.vaultAmount = new bn_js_1.default(vaultInfo.amount.toString());
    }
    return rewardInfo;
}
async function getTokenVaultAccountInfos(fetcher, data, opts) {
    const vaultA = data.tokenVaultA;
    const vaultInfoA = await fetcher.getTokenInfo(vaultA, opts);
    if (!vaultInfoA) {
        throw new Error(`Unable to fetch TokenAccountInfo for vault - ${vaultA}`);
    }
    const vaultB = data.tokenVaultB;
    const vaultInfoB = await fetcher.getTokenInfo(vaultB, opts);
    if (!vaultInfoB) {
        throw new Error(`Unable to fetch TokenAccountInfo for vault - ${vaultB}`);
    }
    return [vaultInfoA, vaultInfoB];
}
exports.getTokenVaultAccountInfos = getTokenVaultAccountInfos;

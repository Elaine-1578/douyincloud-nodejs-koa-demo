// ============================================================
// VIP 特权服务
// ============================================================

import { VIP_TABLE, getVIPLevel as getVIPLevelRaw, getVIPConfig, getNextVIPAmount } from '../config/VIPTable';

export interface IVIPInfo {
  level: number;
  needAmount: number;       // 当前等级所需累计消费
  nextLevelAmount: number;  // 下一级所需金额（-1表示已满级）
  expBonus: number;         // 挂机加成（%）
  rareBonus: number;        // 稀有概率加成（%）
  maxDailyPull: number;     // 每日抽取上限
  corePrivileges: string[];
  isMaxLevel: boolean;
  progress: number;         // 到下一级的进度（0-100）
}

// ===== 获取完整 VIP 信息 =====
export function getVIPInfo(totalRecharge: number): IVIPInfo {
  const level = getVIPLevelRaw(totalRecharge);
  const config = getVIPConfig(level);
  const nextAmount = getNextVIPAmount(level);
  const nextConfig = level < 15 ? getVIPConfig(level + 1) : null;

  let progress = 0;
  if (nextConfig) {
    const currentAmount = config.needAmount;
    const nextAmountValue = nextConfig.needAmount;
    const diff = nextAmountValue - currentAmount;
    const progressAmount = totalRecharge - currentAmount;
    progress = diff > 0 ? (progressAmount / diff) * 100 : 0;
  } else {
    progress = 100;
  }

  return {
    level,
    needAmount: config.needAmount,
    nextLevelAmount: nextAmount,
    expBonus: config.expBonus,
    rareBonus: config.rareBonus,
    maxDailyPull: config.maxDailyPull,
    corePrivileges: config.corePrivileges,
    isMaxLevel: level >= 15,
    progress: Math.min(Math.max(progress, 0), 100)
  };
}

// ===== 获取挂机经验加成（含VIP加成） =====
export function getExpBonus(vipLevel: number): number {
  const config = getVIPConfig(vipLevel);
  return config.expBonus;
}

// ===== 获取稀有概率加成（含VIP加成） =====
export function getRareBonus(vipLevel: number): number {
  const config = getVIPConfig(vipLevel);
  return config.rareBonus;
}

// ===== 获取每日抽取上限 =====
export function getDailyPullLimit(vipLevel: number): number {
  const config = getVIPConfig(vipLevel);
  return config.maxDailyPull;
}

// ===== 检查今日是否还能抽取 =====
export function canDrawToday(vipLevel: number, todayDrawCount: number): boolean {
  const limit = getDailyPullLimit(vipLevel);
  return todayDrawCount < limit;
}

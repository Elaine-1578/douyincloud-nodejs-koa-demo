// ============================================================
// 等级与战力服务
// ============================================================

import { LEVEL_TABLE, calcLevel as calcLevelRaw, getPower, getExpNeeded, getTotalExp } from '../config/LevelTable';

export interface ILevelInfo {
  level: number;
  exp: number;
  remainingExp: number;      // 当前等级已获得的经验
  expNeeded: number;         // 当前等级升级所需总经验
  progress: number;          // 当前等级进度（0-100）
  power: number;             // 当前基础战力
  totalExp: number;          // 累计总经验
  isMaxLevel: boolean;       // 是否满级
}

// ===== 获取完整等级信息 =====
export function getLevelInfo(exp: number): ILevelInfo {
  const { level, remainingExp } = calcLevelRaw(exp);
  const expNeeded = getExpNeeded(level);
  const power = getPower(level);
  const totalExp = getTotalExp(level) + remainingExp;
  const progress = expNeeded > 0 ? (remainingExp / expNeeded) * 100 : 100;
  const isMaxLevel = level >= 150;

  return {
    level,
    exp,
    remainingExp,
    expNeeded,
    progress: Math.min(progress, 100),
    power,
    totalExp,
    isMaxLevel
  };
}

// ===== 增加经验（返回升级后的新状态） =====
export function addExp(currentExp: number, addAmount: number): {
  newExp: number;
  leveledUp: boolean;
  oldLevel: number;
  newLevel: number;
  overflowExp: number;      // 溢出经验（满级后用于境界点转化）
} {
  const oldLevel = calcLevelRaw(currentExp).level;
  const newExp = currentExp + addAmount;
  const { level: newLevel, remainingExp } = calcLevelRaw(newExp);
  const leveledUp = newLevel > oldLevel;
  
  // 如果满级（150级），溢出经验用于境界点转化
  let overflowExp = 0;
  if (newLevel >= 150) {
    // 满级后的额外经验
    const maxLevelData = LEVEL_TABLE[150];
    if (maxLevelData) {
      overflowExp = newExp - getTotalExp(150);
    }
  }

  return {
    newExp,
    leveledUp,
    oldLevel,
    newLevel: Math.min(newLevel, 150),
    overflowExp: overflowExp > 0 ? overflowExp : 0
  };
}

// ===== 计算战力（基础战力 + 装备加成等） =====
export function calcTotalPower(level: number, gearBonus: number = 0): number {
  const basePower = getPower(level);
  return Math.floor(basePower * (1 + gearBonus / 100));
}

// ===== 检查是否可升级 =====
export function canLevelUp(exp: number): boolean {
  const { level, remainingExp } = calcLevelRaw(exp);
  if (level >= 150) return false;
  const needed = getExpNeeded(level);
  return remainingExp >= needed;
}

// ===== 批量计算等级信息（用于排行榜） =====
export function getLevelInfoBatch(expList: number[]): ILevelInfo[] {
  return expList.map(exp => getLevelInfo(exp));
}

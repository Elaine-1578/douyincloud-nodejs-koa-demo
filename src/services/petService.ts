// ============================================================
// 宠物服务
// ============================================================

import { PET_TABLE, IPetConfig } from '../config/PetTable';

// 宠物等级经验表（1-50级，原始数值×25）
const PET_LEVEL_EXP: Record<number, number> = {
  1: 2000,
  2: 2375,
  3: 2750,
  4: 3250,
  5: 3750,
  6: 4375,
  7: 5000,
  8: 5750,
  9: 6500,
  10: 7500,
  11: 8500,
  12: 9625,
  13: 10750,
  14: 12000,
  15: 13375,
  16: 14875,
  17: 16500,
  18: 18250,
  19: 20125,
  20: 22125,
  21: 24375,
  22: 26750,
  23: 29250,
  24: 31875,
  25: 34625,
  26: 37625,
  27: 40750,
  28: 44125,
  29: 47750,
  30: 51625,
  31: 55750,
  32: 60125,
  33: 64750,
  34: 69625,
  35: 74875,
  36: 80375,
  37: 86250,
  38: 92375,
  39: 98875,
  40: 105750,
  41: 113000,
  42: 120625,
  43: 128625,
  44: 137125,
  45: 146000,
  46: 155375,
  47: 165250,
  48: 175625,
  49: 186500,
  50: 198000
};

// 宠物最大等级
const MAX_PET_LEVEL = 50;

export interface IPetInfo {
  id: string;
  name: string;
  icon: string;
  level: number;
  exp: number;
  expNeeded: number;        // 当前等级升级所需经验
  progress: number;         // 当前等级进度（0-100）
  isMaxLevel: boolean;
  attackCoeff: number;
  hpCoeff: number;
  ability: string;
 克制: string;
 被克制: string;
}

export interface IPetLevelUpResult {
  leveledUp: boolean;
  oldLevel: number;
  newLevel: number;
  remainingExp: number;     // 升级后剩余经验
  overflowExp: number;      // 溢出经验（存到背包）
}

// ===== 获取宠物配置 =====
export function getPetConfig(petId: string): IPetConfig | undefined {
  return PET_TABLE[petId];
}

// ===== 获取全部宠物列表 =====
export function getAllPets(): IPetConfig[] {
  return Object.values(PET_TABLE);
}

// ===== 获取宠物等级所需经验 =====
export function getPetExpNeeded(level: number): number {
  if (level >= MAX_PET_LEVEL) return Infinity;
  return PET_LEVEL_EXP[level] || Infinity;
}

// ===== 获取宠物信息 =====
export function getPetInfo(petId: string, level: number, exp: number): IPetInfo | null {
  const config = getPetConfig(petId);
  if (!config) return null;

  const expNeeded = getPetExpNeeded(level);
  const isMaxLevel = level >= MAX_PET_LEVEL;
  const progress = isMaxLevel ? 100 : (exp / expNeeded) * 100;

  return {
    id: config.id,
    name: config.name,
    icon: config.icon,
    level,
    exp,
    expNeeded: isMaxLevel ? 0 : expNeeded,
    progress: Math.min(progress, 100),
    isMaxLevel,
    attackCoeff: config.attackCoeff,
    hpCoeff: config.hpCoeff,
    ability: config.ability,
    克制: config.克制,
    被克制: config.被克制
  };
}

// ===== 宠物升级 =====
export function levelUpPet(petId: string, currentLevel: number, currentExp: number, addExp: number): IPetLevelUpResult {
  let newLevel = currentLevel;
  let newExp = currentExp + addExp;
  let overflowExp = 0;
  let leveledUp = false;

  while (newLevel < MAX_PET_LEVEL) {
    const needed = getPetExpNeeded(newLevel);
    if (newExp >= needed) {
      newExp -= needed;
      newLevel++;
      leveledUp = true;
    } else {
      break;
    }
  }

  // 满级后溢出经验存背包
  if (newLevel >= MAX_PET_LEVEL) {
    overflowExp = newExp;
    newExp = 0;
  }

  return {
    leveledUp,
    oldLevel: currentLevel,
    newLevel: Math.min(newLevel, MAX_PET_LEVEL),
    remainingExp: newExp,
    overflowExp
  };
}

// ===== 计算宠物最终战力 =====
export function calcPetPower(
  petId: string,
  level: number,
  playerPower: number,
  weatherBonus: number = 1,
  abilityBonus: number = 1,
  relicBonus: number = 1
): { attack: number; hp: number } {
  const config = getPetConfig(petId);
  if (!config) return { attack: 0, hp: 0 };

  const levelMultiplier = 1 + (level - 1) * 0.008; // 每级+0.8%
  const baseAttack = playerPower * config.attackCoeff;
  const baseHp = playerPower * config.hpCoeff;

  const finalAttack = Math.floor(
    baseAttack * levelMultiplier * weatherBonus * abilityBonus * relicBonus
  );
  const finalHp = Math.floor(
    baseHp * levelMultiplier * weatherBonus * abilityBonus * relicBonus
  );

  return { attack: finalAttack, hp: finalHp };
}

// ===== 获取宠物克制倍率 =====
export function getPetCounterBonus(attackerId: string, defenderId: string): number {
  const attacker = getPetConfig(attackerId);
  if (!attacker) return 1;

  // 如果攻击者克制防御者，返回1.3
  if (attacker.克制 === getPetConfig(defenderId)?.name) {
    return 1.3;
  }
  // 如果攻击者被防御者克制，返回0.8
  if (attacker.被克制 === getPetConfig(defenderId)?.name) {
    return 0.8;
  }
  return 1;
}

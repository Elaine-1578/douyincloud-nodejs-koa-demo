// ============================================================
// 异能服务（抽取、概率、保底）
// ============================================================

import {
  ABILITY_TABLE,
  getAbilityById,
  getBasicAbilities,
  getRareAbilities,
  randomDrawAbility,
  IAbilityConfig
} from '../config/AbilityTable';
import { getRareBonus } from './vipService';

// ===== 异能池状态接口 =====
export interface IAbilityPoolState {
  totalDraws: number;           // 总抽取次数
  consecutiveNoRare: number;    // 连续未出稀有的次数
  hardPityProgress: number;     // 硬保底累计消费进度（元）
  hasHardPityTriggered: boolean; // 是否已触发硬保底
}

// ===== 抽取结果接口 =====
export interface IDrawResult {
  ability: IAbilityConfig;
  isRare: boolean;
  isHardPity: boolean;          // 是否由硬保底触发
  softPityTriggered: boolean;   // 是否由软保底触发
  consecutiveNoRare: number;    // 更新后的连续未出次数
}

// ===== 异能槽位管理 =====
export interface IAbilitySlots {
  primary: string | null;       // 主槽
  secondary: string | null;     // 副槽（VIP5解锁）
}

// ===== 软保底配置 =====
const SOFT_PITY_CONFIG = {
  startAfter: 50,              // 50抽后开始递增
  incrementPerDraw: 0.0005,    // 每抽递增0.05%
  maxRate: 0.08               // 上限8%
};

// ===== 硬保底配置 =====
const HARD_PITY_CONFIG = {
  threshold: 10000,            // 累计消费10000元触发
  tenPullCost: 99              // 十连抽消耗99元（990钻石≈99元）
};

// ===== 计算软保底概率 =====
export function calculateSoftPityRate(consecutiveNoRare: number): number {
  if (consecutiveNoRare < SOFT_PITY_CONFIG.startAfter) {
    return 0; // 基础概率3%，软保底加的是额外概率
  }
  const extraRate = (consecutiveNoRare - SOFT_PITY_CONFIG.startAfter) * SOFT_PITY_CONFIG.incrementPerDraw;
  return Math.min(extraRate, SOFT_PITY_CONFIG.maxRate);
}

// ===== 单次抽取（含软保底） =====
export function drawAbility(
  poolState: IAbilityPoolState,
  vipLevel: number = 0
): IDrawResult {
  let { totalDraws, consecutiveNoRare, hardPityProgress } = poolState;
  let isHardPity = false;
  let isRare = false;
  let softPityTriggered = false;

  // 检查硬保底
  if (hardPityProgress >= HARD_PITY_CONFIG.threshold) {
    isHardPity = true;
    isRare = true;
    // 重置硬保底进度（触发后清零）
    hardPityProgress = 0;
  } else {
    // 计算概率
    const vipRareBonus = getRareBonus(vipLevel);
    const baseRareRate = 0.03; // 3%
    const softPityExtra = calculateSoftPityRate(consecutiveNoRare);
    const totalRareRate = Math.min(
      baseRareRate + softPityExtra + (vipRareBonus / 100),
      0.5 // 最高不超过50%
    );

    // 随机判定
    const rand = Math.random();
    if (rand < totalRareRate) {
      isRare = true;
      if (softPityExtra > 0) {
        softPityTriggered = true;
      }
    }
  }

  // 根据是否稀有选择池子
  let ability: IAbilityConfig;
  if (isRare) {
    const rarePool = getRareAbilities();
    ability = rarePool[Math.floor(Math.random() * rarePool.length)];
    consecutiveNoRare = 0; // 重置连续未出
  } else {
    const basicPool = getBasicAbilities();
    ability = basicPool[Math.floor(Math.random() * basicPool.length)];
    consecutiveNoRare += 1;
  }

  totalDraws += 1;

  return {
    ability,
    isRare,
    isHardPity,
    softPityTriggered,
    consecutiveNoRare
  };
}

// ===== 十连抽取 =====
export function drawTenAbilities(
  poolState: IAbilityPoolState,
  vipLevel: number = 0
): { results: IDrawResult[]; rareCount: number; hasHardPity: boolean } {
  const results: IDrawResult[] = [];
  let rareCount = 0;
  let hasHardPity = false;

  // 十连抽中如果硬保底触发，只触发一次
  let currentState = { ...poolState };

  for (let i = 0; i < 10; i++) {
    const result = drawAbility(currentState, vipLevel);
    results.push(result);
    if (result.isRare) rareCount++;
    if (result.isHardPity) hasHardPity = true;

    // 更新状态（硬保底触发后已重置）
    currentState.totalDraws += 1;
    currentState.consecutiveNoRare = result.consecutiveNoRare;
    if (!result.isHardPity) {
      // 硬保底触发已在 drawAbility 中重置，这里再确保一下
      currentState.hardPityProgress = currentState.hardPityProgress || 0;
    }
  }

  return { results, rareCount, hasHardPity };
}

// ===== 获取保底进度信息 =====
export function getPityInfo(poolState: IAbilityPoolState, vipLevel: number = 0): {
  consecutiveNoRare: number;
  softPityRate: number;
  hardPityProgress: number;
  hardPityRemaining: number;
  totalDraws: number;
} {
  return {
    consecutiveNoRare: poolState.consecutiveNoRare,
    softPityRate: calculateSoftPityRate(poolState.consecutiveNoRare),
    hardPityProgress: poolState.hardPityProgress,
    hardPityRemaining: Math.max(0, HARD_PITY_CONFIG.threshold - poolState.hardPityProgress),
    totalDraws: poolState.totalDraws
  };
}

// ===== 管理异能槽位 =====
export function equipAbility(
  slots: IAbilitySlots,
  abilityId: string,
  slot: 'primary' | 'secondary'
): { success: boolean; slots: IAbilitySlots; message: string } {
  const ability = getAbilityById(abilityId);
  if (!ability) {
    return { success: false, slots, message: '异能不存在' };
  }

  // 检查副槽是否解锁（需要VIP5）
  if (slot === 'secondary' && !slots.secondary) {
    // 这里只做逻辑校验，实际VIP检查由调用方处理
    return { success: false, slots, message: '副槽未解锁，请先升级VIP到5级' };
  }

  const newSlots = { ...slots };
  if (slot === 'primary') {
    newSlots.primary = abilityId;
  } else {
    newSlots.secondary = abilityId;
  }

  return { success: true, slots: newSlots, message: `已装备 ${ability.name}` };
}

// ===== 替换异能 =====
export function replaceAbility(
  slots: IAbilitySlots,
  abilityId: string,
  slot: 'primary' | 'secondary'
): { success: boolean; slots: IAbilitySlots; message: string } {
  const ability = getAbilityById(abilityId);
  if (!ability) {
    return { success: false, slots, message: '异能不存在' };
  }

  const newSlots = { ...slots };
  if (slot === 'primary') {
    newSlots.primary = abilityId;
  } else {
    if (!slots.secondary) {
      return { success: false, slots, message: '副槽为空，请先装备' };
    }
    newSlots.secondary = abilityId;
  }

  return { success: true, slots: newSlots, message: `已替换为 ${ability.name}` };
}

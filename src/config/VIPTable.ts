// ============================================================
// VIP 特权配置表（VIP0-15）
// 数据来源：文档 5
// ============================================================

export interface IVIPConfig {
  level: number;
  needAmount: number;      // 累计消费（人民币）
  expBonus: number;        // 挂机加成（%）
  rareBonus: number;       // 稀有概率加成（%）
  maxDailyPull: number;    // 每日抽取上限
  corePrivileges: string[]; // 核心特权描述
}

export const VIP_TABLE: Record<number, IVIPConfig> = {
  0: {
    level: 0,
    needAmount: 0,
    expBonus: 0,
    rareBonus: 0,
    maxDailyPull: 5,
    corePrivileges: ['单异能槽基础权限', '免费基础养成全覆盖']
  },
  1: {
    level: 1,
    needAmount: 50,
    expBonus: 5,
    rareBonus: 2,
    maxDailyPull: 8,
    corePrivileges: ['专属标识', '背包小幅扩容']
  },
  2: {
    level: 2,
    needAmount: 200,
    expBonus: 10,
    rareBonus: 4,
    maxDailyPull: 12,
    corePrivileges: ['死亡等级跌落-1', '开荒减负']
  },
  3: {
    level: 3,
    needAmount: 500,
    expBonus: 15,
    rareBonus: 6,
    maxDailyPull: 18,
    corePrivileges: ['解锁VIP每日礼包']
  },
  4: {
    level: 4,
    needAmount: 1200,
    expBonus: 20,
    rareBonus: 8,
    maxDailyPull: 25,
    corePrivileges: ['开荒冷却-10%']
  },
  5: {
    level: 5,
    needAmount: 2500,
    expBonus: 25,
    rareBonus: 12,
    maxDailyPull: 35,
    corePrivileges: ['解锁双异能槽', '死亡最多跌落4级']
  },
  6: {
    level: 6,
    needAmount: 5000,
    expBonus: 30,
    rareBonus: 16,
    maxDailyPull: 45,
    corePrivileges: ['道具掉落+8%', '专属头衔']
  },
  7: {
    level: 7,
    needAmount: 10000,
    expBonus: 35,
    rareBonus: 20,
    maxDailyPull: 55,
    corePrivileges: ['开荒队伍上限9人']
  },
  8: {
    level: 8,
    needAmount: 20000,
    expBonus: 40,
    rareBonus: 24,
    maxDailyPull: 65,
    corePrivileges: ['境界点获取+10%']
  },
  9: {
    level: 9,
    needAmount: 40000,
    expBonus: 45,
    rareBonus: 28,
    maxDailyPull: 80,
    corePrivileges: ['每日1次开荒失败保次数']
  },
  10: {
    level: 10,
    needAmount: 80000,
    expBonus: 50,
    rareBonus: 33,
    maxDailyPull: 100,
    corePrivileges: ['死亡最多跌落2级', '掉落+15%']
  },
  11: {
    level: 11,
    needAmount: 150000,
    expBonus: 53,
    rareBonus: 38,
    maxDailyPull: 120,
    corePrivileges: ['每日免费异能抽取+1']
  },
  12: {
    level: 12,
    needAmount: 250000,
    expBonus: 56,
    rareBonus: 43,
    maxDailyPull: 145,
    corePrivileges: ['异能切换无冷却']
  },
  13: {
    level: 13,
    needAmount: 400000,
    expBonus: 59,
    rareBonus: 48,
    maxDailyPull: 170,
    corePrivileges: ['掉落+20%', '队伍上限10人']
  },
  14: {
    level: 14,
    needAmount: 600000,
    expBonus: 62,
    rareBonus: 54,
    maxDailyPull: 200,
    corePrivileges: ['死亡惩罚减半', '每日免费抽取+2']
  },
  15: {
    level: 15,
    needAmount: 1000000,
    expBonus: 65,
    rareBonus: 60,
    maxDailyPull: 240,
    corePrivileges: ['双槽独立境界分配', '掉落+25%']
  }
};

// ========== 工具函数 ==========

// 根据累计消费获取VIP等级
export function getVIPLevel(totalRecharge: number): number {
  let vipLevel = 0;
  for (const key in VIP_TABLE) {
    const vip = VIP_TABLE[Number(key)];
    if (totalRecharge >= vip.needAmount) {
      vipLevel = vip.level;
    }
  }
  return vipLevel;
}

// 获取VIP配置
export function getVIPConfig(level: number): IVIPConfig {
  return VIP_TABLE[Math.min(level, 15)] || VIP_TABLE[0];
}

// 获取下一级VIP所需金额（返回-1表示已满级）
export function getNextVIPAmount(currentLevel: number): number {
  const next = VIP_TABLE[currentLevel + 1];
  return next ? next.needAmount : -1;
}

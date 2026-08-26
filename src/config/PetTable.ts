// ============================================================
// 异能数据表（5基础 + 3高阶稀有）
// ============================================================

export interface IAbilityConfig {
  id: string;
  name: string;
  icon: string;
  rarity: 'basic' | 'rare';  // basic=基础异能, rare=高阶稀有
  description: string;
  damageBonus: number;       // 伤害增幅（%）
  defenseBonus: number;      // 防御增幅（%）
  specialEffect?: string;    // 特殊效果描述
}

// ===== 5系基础异能 =====
const BASIC_ABILITIES: IAbilityConfig[] = [
  {
    id: 'fire_control',
    name: '炎烬操控',
    icon: '🔥',
    rarity: 'basic',
    description: '操控火焰，造成持续灼烧伤害',
    damageBonus: 15,
    defenseBonus: 0,
    specialEffect: '灼烧：目标每回合损失5%生命，持续3回合'
  },
  {
    id: 'ice_control',
    name: '永寒冰封',
    icon: '❄️',
    rarity: 'basic',
    description: '冰霜之力，冻结敌人行动',
    damageBonus: 10,
    defenseBonus: 10,
    specialEffect: '冻结：目标下回合无法行动'
  },
  {
    id: 'thunder_control',
    name: '雷霆奔袭',
    icon: '⚡',
    rarity: 'basic',
    description: '雷电之力，高速打击',
    damageBonus: 20,
    defenseBonus: 0,
    specialEffect: '连击：有30%概率触发额外一次攻击'
  },
  {
    id: 'plague_control',
    name: '瘴疫腐化',
    icon: '☠️',
    rarity: 'basic',
    description: '瘟疫之力，持续削弱敌人',
    damageBonus: 8,
    defenseBonus: 5,
    specialEffect: '腐化：目标攻击力降低15%，持续3回合'
  },
  {
    id: 'sand_control',
    name: '砂砾固铠',
    icon: '🛡️',
    rarity: 'basic',
    description: '沙石护盾，强化防御',
    damageBonus: 0,
    defenseBonus: 25,
    specialEffect: '护盾：抵挡下一次受到的攻击'
  }
];

// ===== 3系高阶稀有异能 =====
const RARE_ABILITIES: IAbilityConfig[] = [
  {
    id: 'life_cycle',
    name: '命丝轮回',
    icon: '♻️',
    rarity: 'rare',
    description: '操控生命轮回之力',
    damageBonus: 18,
    defenseBonus: 12,
    specialEffect: '轮回：死亡时复活一次，恢复30%生命'
  },
  {
    id: 'soul_control',
    name: '幻魂摄魄',
    icon: '👁️',
    rarity: 'rare',
    description: '操控灵魂，支配敌人心智',
    damageBonus: 22,
    defenseBonus: 5,
    specialEffect: '摄魂：有20%概率控制目标，使其攻击己方'
  },
  {
    id: 'void_return',
    name: '质界归墟',
    icon: '🌀',
    rarity: 'rare',
    description: '虚空之力，湮灭一切',
    damageBonus: 30,
    defenseBonus: 0,
    specialEffect: '湮灭：攻击有15%概率直接秒杀目标（Boss无效）'
  }
];

// ===== 合并导出 =====
export const ABILITY_TABLE: IAbilityConfig[] = [
  ...BASIC_ABILITIES,
  ...RARE_ABILITIES
];

// ===== 工具函数 =====

// 根据ID获取异能配置
export function getAbilityById(id: string): IAbilityConfig | undefined {
  return ABILITY_TABLE.find(a => a.id === id);
}

// 获取所有基础异能
export function getBasicAbilities(): IAbilityConfig[] {
  return ABILITY_TABLE.filter(a => a.rarity === 'basic');
}

// 获取所有高阶稀有异能
export function getRareAbilities(): IAbilityConfig[] {
  return ABILITY_TABLE.filter(a => a.rarity === 'rare');
}

// 随机抽取异能（基础97%，稀有3%）
export function randomDrawAbility(): IAbilityConfig {
  const rand = Math.random() * 100;
  const rarePool = getRareAbilities();
  const basicPool = getBasicAbilities();

  if (rand < 3 && rarePool.length > 0) {
    // 3% 概率出稀有
    return rarePool[Math.floor(Math.random() * rarePool.length)];
  } else {
    // 97% 概率出基础
    return basicPool[Math.floor(Math.random() * basicPool.length)];
  }
}

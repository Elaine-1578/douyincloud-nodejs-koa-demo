// ============================================================
// 道具数据表
// ============================================================

export interface IItemConfig {
  id: string;
  name: string;
  icon: string;
  type: 'pet_food' | 'draw_ticket' | 'relic' | 'material';
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  description: string;
  value?: number;           // 数值（宠物经验/钻石等）
  dropRate?: number;        // 掉落概率（%）
}

// ===== 宠物口粮（4种） =====
const PET_FOODS: IItemConfig[] = [
  {
    id: 'pet_food_basic',
    name: '初级宠物口粮',
    icon: '🦴',
    type: 'pet_food',
    rarity: 'common',
    description: '增加1250宠物经验',
    value: 1250,
    dropRate: 72
  },
  {
    id: 'pet_food_mid',
    name: '中级宠物饲粮',
    icon: '🍖',
    type: 'pet_food',
    rarity: 'uncommon',
    description: '增加3750宠物经验',
    value: 3750,
    dropRate: 25
  },
  {
    id: 'pet_food_high',
    name: '高级宠物资质丸',
    icon: '💊',
    type: 'pet_food',
    rarity: 'rare',
    description: '增加10000宠物经验',
    value: 10000,
    dropRate: 3
  },
  {
    id: 'pet_food_epic',
    name: '极品宠物进阶晶',
    icon: '💎',
    type: 'pet_food',
    rarity: 'epic',
    description: '增加25000宠物经验',
    value: 25000,
    dropRate: 0
  }
];

// ===== 抽取道具 =====
const DRAW_ITEMS: IItemConfig[] = [
  {
    id: 'energy_battery',
    name: '能量电池',
    icon: '🔋',
    type: 'draw_ticket',
    rarity: 'uncommon',
    description: '异能抽取消耗品（单次）',
    value: 99  // 钻石价值
  }
];

// ===== 遗物（4品质） =====
const RELICS: IItemConfig[] = [
  {
    id: 'relic_common',
    name: '普通遗物',
    icon: '📜',
    type: 'relic',
    rarity: 'common',
    description: '资源+3%，天气伤害减免+3%，开荒输出+2%，消耗-2%',
    value: 0
  },
  {
    id: 'relic_uncommon',
    name: '精良遗物',
    icon: '📄',
    type: 'relic',
    rarity: 'uncommon',
    description: '资源+6%，天气伤害减免+6%，开荒输出+4%，消耗-4%',
    value: 0
  },
  {
    id: 'relic_rare',
    name: '史诗遗物',
    icon: '📖',
    type: 'relic',
    rarity: 'rare',
    description: '资源+12%，天气伤害减免+10%，开荒输出+8%，消耗-6%，稀有掉落+5%',
    value: 0
  },
  {
    id: 'relic_legendary',
    name: '传说遗物',
    icon: '📜✨',
    type: 'relic',
    rarity: 'legendary',
    description: '资源+20%，天气伤害减免+15%，开荒输出+15%，消耗-10%，稀有掉落+10%，机甲全员战力+5%',
    value: 0
  }
];

// ===== 材料 =====
const MATERIALS: IItemConfig[] = [
  {
    id: 'wood',
    name: '木材',
    icon: '🪵',
    type: 'material',
    rarity: 'common',
    description: '基础建筑材料',
    value: 0
  },
  {
    id: 'stone',
    name: '石头',
    icon: '🪨',
    type: 'material',
    rarity: 'common',
    description: '基础建筑材料',
    value: 0
  },
  {
    id: 'iron',
    name: '铁锭',
    icon: '⚙️',
    type: 'material',
    rarity: 'uncommon',
    description: '进阶材料',
    value: 0
  },
  {
    id: 'cloth',
    name: '布料',
    icon: '🧵',
    type: 'material',
    rarity: 'common',
    description: '基础材料',
    value: 0
  },
  {
    id: 'leather',
    name: '皮革',
    icon: '🛡️',
    type: 'material',
    rarity: 'uncommon',
    description: '进阶材料',
    value: 0
  },
  {
    id: 'gem',
    name: '宝石',
    icon: '💎',
    type: 'material',
    rarity: 'rare',
    description: '稀有材料',
    value: 0
  }
];

// ===== 合并导出 =====
export const ITEM_TABLE: IItemConfig[] = [
  ...PET_FOODS,
  ...DRAW_ITEMS,
  ...RELICS,
  ...MATERIALS
];

// ===== 工具函数 =====

// 根据ID获取道具配置
export function getItemById(id: string): IItemConfig | undefined {
  return ITEM_TABLE.find(item => item.id === id);
}

// 按类型获取道具
export function getItemsByType(type: IItemConfig['type']): IItemConfig[] {
  return ITEM_TABLE.filter(item => item.type === type);
}

// 获取宠物口粮（按稀有度排序）
export function getPetFoods(): IItemConfig[] {
  return PET_FOODS;
}

// 获取遗物（按稀有度排序）
export function getRelics(): IItemConfig[] {
  return RELICS;
}

// 根据场景获取掉落池（场景等级：low/mid/high/top）
export function getDropPool(sceneLevel: 'low' | 'mid' | 'high' | 'top'): IItemConfig[] {
  // 不同场景对应不同的掉落概率组合
  // 这里简单返回所有宠物口粮，实际使用时根据场景调整概率
  return PET_FOODS;
}

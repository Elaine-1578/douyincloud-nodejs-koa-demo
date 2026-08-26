// ============================================================
// 极端天气系统配置
// ============================================================

export interface IWeatherConfig {
  id: string;
  name: string;
  icon: string;
  description: string;
  buffAbility: string;    // 增益异能ID
  debuffAbility: string;  // 削弱异能ID
}

// 高阶异能ID列表（不受天气影响）
export const HIGH_ABILITY_IDS = [
  'life_cycle',   // 命丝轮回
  'soul_control', // 幻魂摄魄
  'void_return'   // 质界归墟
];

export const WEATHER_LIST: IWeatherConfig[] = [
  {
    id: 'fire_storm',
    name: '焚烬焚风',
    icon: '🌪️',
    description: '炎烬操控+5%，瘴疫腐化-5%',
    buffAbility: 'fire_control',
    debuffAbility: 'plague_control'
  },
  {
    id: 'ice_meteor',
    name: '永夜冰陨',
    icon: '❄️',
    description: '永寒冰封+5%，砂砾固铠-5%',
    buffAbility: 'ice_control',
    debuffAbility: 'sand_control'
  },
  {
    id: 'thunder_storm',
    name: '狂雷风暴',
    icon: '⚡',
    description: '雷霆奔袭+5%，炎烬操控-5%',
    buffAbility: 'thunder_control',
    debuffAbility: 'fire_control'
  },
  {
    id: 'plague_mist',
    name: '腐瘴弥漫',
    icon: '☠️',
    description: '瘴疫腐化+5%，永寒冰封-5%',
    buffAbility: 'plague_control',
    debuffAbility: 'ice_control'
  },
  {
    id: 'sand_storm',
    name: '黄沙浩劫',
    icon: '🏜️',
    description: '砂砾固铠+5%，雷霆奔袭-5%',
    buffAbility: 'sand_control',
    debuffAbility: 'thunder_control'
  }
];

// ===== 工具函数 =====

// 随机获取一种天气
export function getRandomWeather(): IWeatherConfig {
  const index = Math.floor(Math.random() * WEATHER_LIST.length);
  return WEATHER_LIST[index];
}

// 判断是否为高阶异能（不受天气影响）
export function isHighAbility(abilityId: string): boolean {
  return HIGH_ABILITY_IDS.includes(abilityId);
}

// 获取天气对异能的增益/削弱效果
export function getWeatherEffect(weatherId: string, abilityId: string): {
  type: 'buff' | 'debuff' | 'none';
  value: number;
} {
  const weather = WEATHER_LIST.find(w => w.id === weatherId);
  if (!weather) return { type: 'none', value: 0 };

  // 高阶异能不受影响
  if (isHighAbility(abilityId)) {
    return { type: 'none', value: 0 };
  }

  if (abilityId === weather.buffAbility) {
    return { type: 'buff', value: 0.05 }; // +5%
  }
  if (abilityId === weather.debuffAbility) {
    return { type: 'debuff', value: 0.05 }; // -5%
  }
  return { type: 'none', value: 0 };
}

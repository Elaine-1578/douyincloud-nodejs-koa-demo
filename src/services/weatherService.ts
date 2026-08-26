// ============================================================
// 天气服务
// ============================================================

import { WEATHER_LIST, getRandomWeather, getWeatherEffect, isHighAbility, IWeatherConfig } from '../config/WeatherTable';

// 检查是否需要刷新天气（每日06:00刷新）
export function shouldRefreshWeather(lastUpdated: Date): boolean {
  const now = new Date();
  const last = new Date(lastUpdated);
  
  const today6am = new Date(now);
  today6am.setHours(6, 0, 0, 0);
  
  if (last >= today6am) {
    return false;
  }
  
  return now >= today6am;
}

// 刷新天气
export function refreshWeather(): {
  id: string;
  name: string;
  icon: string;
  updatedAt: Date;
} {
  const weather = getRandomWeather();
  return {
    id: weather.id,
    name: weather.name,
    icon: weather.icon,
    updatedAt: new Date()
  };
}

// 获取当前天气信息（含是否需要刷新）
export function getCurrentWeatherInfo(lastUpdated: Date): {
  needsRefresh: boolean;
  weather?: {
    id: string;
    name: string;
    icon: string;
    updatedAt: Date;
  };
} {
  if (shouldRefreshWeather(lastUpdated)) {
    const newWeather = refreshWeather();
    return {
      needsRefresh: true,
      weather: newWeather
    };
  }
  return {
    needsRefresh: false
  };
}

// 计算异能最终输出（含天气加成）
export function calculateAbilityWithWeather(
  abilityId: string,
  baseDamage: number,
  weatherId: string
): { finalDamage: number; effectType: 'buff' | 'debuff' | 'none'; effectValue: number } {
  const effect = getWeatherEffect(weatherId, abilityId);
  
  let finalDamage = baseDamage;
  
  if (effect.type === 'buff') {
    finalDamage = baseDamage * (1 + effect.value);
  } else if (effect.type === 'debuff') {
    finalDamage = baseDamage * (1 - effect.value);
  }
  
  return {
    finalDamage,
    effectType: effect.type,
    effectValue: effect.value
  };
}

// 获取天气名称
export function getWeatherName(weatherId: string): string {
  const weather = WEATHER_LIST.find(w => w.id === weatherId);
  return weather ? weather.name : '未知天气';
}

// 获取天气图标
export function getWeatherIcon(weatherId: string): string {
  const weather = WEATHER_LIST.find(w => w.id === weatherId);
  return weather ? weather.icon : '❓';
}

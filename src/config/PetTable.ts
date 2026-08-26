// ============================================================
// 宠物数据表（6只）
// ============================================================

export interface IPetConfig {
  id: string;
  name: string;
  icon: string;
  attackCoeff: number;   // 攻击系数
  hpCoeff: number;       // 生命系数
  ability: string;       // 技能描述
 克制: string;           // 克制对象
 被克制: string;         // 被谁克制
}

export const PET_TABLE: Record<string, IPetConfig> = {
  wolf: {
    id: 'wolf',
    name: '魔狼',
    icon: '🐺',
    attackCoeff: 0.45,
    hpCoeff: 0.25,
    ability: '速攻双次打击',
   克制: '砂砾固铠',
   被克制: '雷霆奔袭'
  },
  rock: {
    id: 'rock',
    name: '岩甲守卫',
    icon: '🪨',
    attackCoeff: 0.22,
    hpCoeff: 0.80,
    ability: '防御嘲讽（20%减伤）',
   克制: '炎烬操控',
   被克制: '瘴疫腐化'
  },
  eagle: {
    id: 'eagle',
    name: '灵羽飞鹰',
    icon: '🦅',
    attackCoeff: 0.38,
    hpCoeff: 0.20,
    ability: '优先打击后排',
   克制: '永寒冰封',
   被克制: '炎烬操控'
  },
  frog: {
    id: 'frog',
    name: '毒沼巨蟾',
    icon: '🐸',
    attackCoeff: 0.30,
    hpCoeff: 0.55,
    ability: '3回合持续毒伤',
   克制: '砂砾固铠',
   被克制: '雷霆奔袭'
  },
  fire: {
    id: 'fire',
    name: '烈焰炎魔',
    icon: '🔥',
    attackCoeff: 0.60,
    hpCoeff: 0.40,
    ability: '小范围AOE群伤',
   克制: '永寒冰封',
   被克制: '瘴疫腐化'
  },
  void: {
    id: 'void',
    name: '虚空幻影',
    icon: '👻',
    attackCoeff: 0.52,
    hpCoeff: 0.33,
    ability: '降低敌方10%输出',
   克制: '瘴疫腐化',
   被克制: '砂砾固铠'
  }
};

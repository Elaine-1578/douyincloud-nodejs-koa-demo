// ============================================================
// 用户数据模型
// ============================================================

export interface IUser {
  userId: string;          // 抖音 openid
  openid: string;          // 备用
  nickname: string;
  level: number;
  exp: number;
  power: number;           // 基础战力
  vipLevel: number;
  diamonds: number;        // 钻石
  ability: string;         // 当前异能
  abilitySlots: string[];  // 已解锁异能
  petExp: number;
  petLevels: {             // 6只宠物等级
    wolf: number;
    rock: number;
    eagle: number;
    frog: number;
    fire: number;
    void: number;
  };
  totalRecharge: number;   // 累计充值（人民币）
  lastLoginTime: Date;
  createdAt: Date;
  updatedAt: Date;
}

// 默认用户
export function createDefaultUser(userId: string): IUser {
  return {
    userId,
    openid: userId,
    nickname: `幸存者_${userId.slice(-4)}`,
    level: 1,
    exp: 0,
    power: 100,
    vipLevel: 0,
    diamonds: 0,
    ability: '无',
    abilitySlots: [],
    petExp: 0,
    petLevels: { wolf: 1, rock: 1, eagle: 1, frog: 1, fire: 1, void: 1 },
    totalRecharge: 0,
    lastLoginTime: new Date(),
    createdAt: new Date(),
    updatedAt: new Date()
  };
}

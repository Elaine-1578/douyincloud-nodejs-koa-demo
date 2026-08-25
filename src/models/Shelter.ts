// ============================================================
// 庇护所数据模型
// ============================================================

export interface IShelter {
  shelterId: string;
  roomId: string;          // 直播间号（唯一）
  level: number;
  exp: number;
  members: string[];       // 用户ID列表
  resources: {
    food: number;
    water: number;
    medicine: number;
    money: number;
  };
  storageMax: number;
  relicSlots: string[];    // 挂载的遗物（最多3件）
  npcCount: number;
  defenseWeapons: string[];
  createdAt: Date;
  updatedAt: Date;
}

export function createDefaultShelter(roomId: string): IShelter {
  return {
    shelterId: `shelter_${roomId}`,
    roomId,
    level: 1,
    exp: 0,
    members: [],
    resources: { food: 100, water: 80, medicine: 20, money: 50 },
    storageMax: 500,
    relicSlots: [],
    npcCount: 0,
    defenseWeapons: [],
    createdAt: new Date(),
    updatedAt: new Date()
  };
}

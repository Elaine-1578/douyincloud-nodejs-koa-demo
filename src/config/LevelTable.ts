// ============================================================
// 等级与战力对照表（Lv1-150）
// 数据来源：文档 2.3 + 3.1
// ============================================================

export interface ILevelData {
  expNeeded: number;   // 本级升级所需经验
  power: number;       // 本级基础战力
}

// 等级表：1-150级
export const LEVEL_TABLE: Record<number, ILevelData> = {
  1: { expNeeded: 3000, power: 100 },
  2: { expNeeded: 3500, power: 140 },
  3: { expNeeded: 4125, power: 180 },
  4: { expNeeded: 4875, power: 220 },
  5: { expNeeded: 5750, power: 270 },
  6: { expNeeded: 6750, power: 320 },
  7: { expNeeded: 7875, power: 380 },
  8: { expNeeded: 9125, power: 440 },
  9: { expNeeded: 10500, power: 510 },
  10: { expNeeded: 12000, power: 580 },
  11: { expNeeded: 16250, power: 660 },
  12: { expNeeded: 18000, power: 750 },
  13: { expNeeded: 20000, power: 850 },
  14: { expNeeded: 22250, power: 960 },
  15: { expNeeded: 24750, power: 1080 },
  16: { expNeeded: 27500, power: 1210 },
  17: { expNeeded: 30500, power: 1350 },
  18: { expNeeded: 33750, power: 1500 },
  19: { expNeeded: 37250, power: 1660 },
  20: { expNeeded: 41000, power: 1830 },
  21: { expNeeded: 45000, power: 2010 },
  22: { expNeeded: 49250, power: 2200 },
  23: { expNeeded: 53750, power: 2400 },
  24: { expNeeded: 58500, power: 2610 },
  25: { expNeeded: 63500, power: 2830 },
  26: { expNeeded: 55000, power: 3060 },
  27: { expNeeded: 61250, power: 3300 },
  28: { expNeeded: 68000, power: 3550 },
  29: { expNeeded: 75250, power: 3810 },
  30: { expNeeded: 83000, power: 4080 },
  31: { expNeeded: 92000, power: 4360 },
  32: { expNeeded: 101500, power: 4650 },
  33: { expNeeded: 111750, power: 4950 },
  34: { expNeeded: 123000, power: 5260 },
  35: { expNeeded: 135000, power: 5580 },
  36: { expNeeded: 148000, power: 5910 },
  37: { expNeeded: 162000, power: 6250 },
  38: { expNeeded: 177000, power: 6600 },
  39: { expNeeded: 193000, power: 6960 },
  40: { expNeeded: 210000, power: 7330 },
  41: { expNeeded: 230000, power: 7710 },
  42: { expNeeded: 251250, power: 8100 },
  43: { expNeeded: 273750, power: 8500 },
  44: { expNeeded: 297500, power: 8910 },
  45: { expNeeded: 322500, power: 9330 },
  46: { expNeeded: 348750, power: 9760 },
  47: { expNeeded: 376250, power: 10200 },
  48: { expNeeded: 405000, power: 10650 },
  49: { expNeeded: 435000, power: 11110 },
  50: { expNeeded: 466250, power: 11580 },
  51: { expNeeded: 498750, power: 12060 },
  52: { expNeeded: 532500, power: 12550 },
  53: { expNeeded: 567500, power: 13050 },
  54: { expNeeded: 603750, power: 13560 },
  55: { expNeeded: 641250, power: 14080 },
  56: { expNeeded: 680000, power: 14610 },
  57: { expNeeded: 720000, power: 15150 },
  58: { expNeeded: 761250, power: 15700 },
  59: { expNeeded: 803750, power: 16260 },
  60: { expNeeded: 847500, power: 16830 },
  61: { expNeeded: 895000, power: 17410 },
  62: { expNeeded: 943750, power: 18000 },
  63: { expNeeded: 993750, power: 18600 },
  64: { expNeeded: 1045000, power: 19210 },
  65: { expNeeded: 1097500, power: 19830 },
  66: { expNeeded: 1152500, power: 20460 },
  67: { expNeeded: 1210000, power: 21100 },
  68: { expNeeded: 1270000, power: 21750 },
  69: { expNeeded: 1332500, power: 22410 },
  70: { expNeeded: 1397500, power: 23080 },
  71: { expNeeded: 1455000, power: 23760 },
  72: { expNeeded: 1517500, power: 24450 },
  73: { expNeeded: 1582500, power: 25150 },
  74: { expNeeded: 1647500, power: 25860 },
  75: { expNeeded: 1715000, power: 26580 },
  76: { expNeeded: 1785000, power: 27310 },
  77: { expNeeded: 1857500, power: 28050 },
  78: { expNeeded: 1927500, power: 28800 },
  79: { expNeeded: 1997500, power: 29560 },
  80: { expNeeded: 2070000, power: 30330 },
  81: { expNeeded: 2150000, power: 31110 },
  82: { expNeeded: 2232500, power: 31900 },
  83: { expNeeded: 2322500, power: 32700 },
  84: { expNeeded: 2420000, power: 33510 },
  85: { expNeeded: 2522500, power: 34330 },
  86: { expNeeded: 2632500, power: 35160 },
  87: { expNeeded: 2752500, power: 36000 },
  88: { expNeeded: 2900000, power: 36850 },
  89: { expNeeded: 3040000, power: 37710 },
  90: { expNeeded: 3195000, power: 38580 },
  91: { expNeeded: 3375000, power: 39460 },
  92: { expNeeded: 3562500, power: 40350 },
  93: { expNeeded: 3755000, power: 41250 },
  94: { expNeeded: 3957500, power: 42160 },
  95: { expNeeded: 4170000, power: 43080 },
  96: { expNeeded: 4420000, power: 44010 },
  97: { expNeeded: 4710000, power: 44950 },
  98: { expNeeded: 4970000, power: 45900 },
  99: { expNeeded: 5245000, power: 46860 },
  100: { expNeeded: 5540000, power: 47830 },
  101: { expNeeded: 5450000, power: 48810 },
  102: { expNeeded: 5895000, power: 49800 },
  103: { expNeeded: 6355000, power: 50800 },
  104: { expNeeded: 6830000, power: 51810 },
  105: { expNeeded: 7320000, power: 52830 },
  106: { expNeeded: 7825000, power: 53860 },
  107: { expNeeded: 8345000, power: 54900 },
  108: { expNeeded: 8880000, power: 55950 },
  109: { expNeeded: 9430000, power: 57010 },
  110: { expNeeded: 9995000, power: 58080 },
  111: { expNeeded: 10875000, power: 59160 },
  112: { expNeeded: 11450000, power: 60250 },
  113: { expNeeded: 12050000, power: 61350 },
  114: { expNeeded: 12675000, power: 62460 },
  115: { expNeeded: 13325000, power: 63580 },
  116: { expNeeded: 14000000, power: 64710 },
  117: { expNeeded: 14700000, power: 65850 },
  118: { expNeeded: 15425000, power: 67000 },
  119: { expNeeded: 16175000, power: 68160 },
  120: { expNeeded: 16950000, power: 69330 },
  121: { expNeeded: 17750000, power: 70510 },
  122: { expNeeded: 18600000, power: 71700 },
  123: { expNeeded: 19500000, power: 72900 },
  124: { expNeeded: 20425000, power: 74110 },
  125: { expNeeded: 21375000, power: 75330 },
  126: { expNeeded: 22425000, power: 76560 },
  127: { expNeeded: 24050000, power: 77800 },
  128: { expNeeded: 25625000, power: 79050 },
  129: { expNeeded: 27250000, power: 80310 },
  130: { expNeeded: 28875000, power: 81580 },
  131: { expNeeded: 30625000, power: 82860 },
  132: { expNeeded: 32500000, power: 84150 },
  133: { expNeeded: 34525000, power: 85450 },
  134: { expNeeded: 36800000, power: 86760 },
  135: { expNeeded: 39125000, power: 88080 },
  136: { expNeeded: 41700000, power: 89410 },
  137: { expNeeded: 44425000, power: 90750 },
  138: { expNeeded: 47325000, power: 92100 },
  139: { expNeeded: 50400000, power: 93460 },
  140: { expNeeded: 53675000, power: 94830 },
  141: { expNeeded: 57150000, power: 96210 },
  142: { expNeeded: 61000000, power: 97600 },
  143: { expNeeded: 65250000, power: 99000 },
  144: { expNeeded: 69700000, power: 100410 },
  145: { expNeeded: 74450000, power: 101830 },
  146: { expNeeded: 79500000, power: 103260 },
  147: { expNeeded: 84875000, power: 104700 },
  148: { expNeeded: 90575000, power: 106150 },
  149: { expNeeded: 96625000, power: 107610 },
  150: { expNeeded: 103000000, power: 109080 }
};

// ========== 工具函数 ==========

// 根据经验值计算等级
export function calcLevel(exp: number): { level: number; remainingExp: number } {
  let level = 1;
  let remaining = exp;
  while (true) {
    const data = LEVEL_TABLE[level];
    if (!data) break;
    if (remaining < data.expNeeded) break;
    remaining -= data.expNeeded;
    level++;
    if (level > 150) break;
  }
  return { level: Math.min(level, 150), remainingExp: remaining };
}

// 获取指定等级的基础战力
export function getPower(level: number): number {
  return LEVEL_TABLE[Math.min(level, 150)]?.power || 100;
}

// 获取指定等级的升级所需经验
export function getExpNeeded(level: number): number {
  return LEVEL_TABLE[Math.min(level, 150)]?.expNeeded || Infinity;
}

// 计算总经验（从1级到指定等级所需累计经验）
export function getTotalExp(level: number): number {
  let total = 0;
  for (let i = 1; i < Math.min(level, 150); i++) {
    total += LEVEL_TABLE[i]?.expNeeded || 0;
  }
  return total;
}

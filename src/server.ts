import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import Router from '@koa/router';
import mongoose from 'mongoose';

// ===== 导入数据模型 =====
import { IUser, createDefaultUser } from './models/User';
import { IShelter, createDefaultShelter } from './models/Shelter';
import { calcLevel, getPower } from './config/LevelTable';
import { getVIPLevel, getVIPConfig } from './config/VIPTable';

const app = new Koa();
const router = new Router();

// ===== MongoDB 连接 =====
const MONGO_ADDRESS = process.env.MONGO_ADDRESS || '';
const MONGO_USERNAME = process.env.MONGO_USERNAME || '';
const MONGO_PASSWORD = process.env.MONGO_PASSWORD || '';

let isDbConnected = false;

async function connectDB() {
  if (!MONGO_ADDRESS) {
    console.warn('⚠️ MONGO_ADDRESS 未设置，使用内存模式');
    return;
  }
  try {
    const mongoUrl = `mongodb://${MONGO_USERNAME}:${encodeURIComponent(MONGO_PASSWORD)}@${MONGO_ADDRESS}`;
    await mongoose.connect(mongoUrl);
    isDbConnected = true;
    console.log('✅ MongoDB 连接成功');
  } catch (err) {
    console.error('❌ MongoDB 连接失败:', err);
  }
}

// ===== 定义 Mongoose Schema =====
const UserSchema = new mongoose.Schema<IUser>({
  userId: { type: String, unique: true },
  openid: { type: String, unique: true },
  nickname: String,
  level: { type: Number, default: 1 },
  exp: { type: Number, default: 0 },
  power: { type: Number, default: 100 },
  vipLevel: { type: Number, default: 0 },
  diamonds: { type: Number, default: 0 },
  ability: { type: String, default: '无' },
  abilitySlots: [String],
  petExp: { type: Number, default: 0 },
  petLevels: {
    wolf: { type: Number, default: 1 },
    rock: { type: Number, default: 1 },
    eagle: { type: Number, default: 1 },
    frog: { type: Number, default: 1 },
    fire: { type: Number, default: 1 },
    void: { type: Number, default: 1 }
  },
  totalRecharge: { type: Number, default: 0 },
  lastLoginTime: { type: Date, default: Date.now },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const ShelterSchema = new mongoose.Schema<IShelter>({
  shelterId: { type: String, unique: true },
  roomId: { type: String, unique: true },
  level: { type: Number, default: 1 },
  exp: { type: Number, default: 0 },
  members: [String],
  resources: {
    food: { type: Number, default: 100 },
    water: { type: Number, default: 80 },
    medicine: { type: Number, default: 20 },
    money: { type: Number, default: 50 }
  },
  storageMax: { type: Number, default: 500 },
  relicSlots: { type: [String], default: [] },
  npcCount: { type: Number, default: 0 },
  defenseWeapons: { type: [String], default: [] },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const User = mongoose.model<IUser>('User', UserSchema);
const Shelter = mongoose.model<IShelter>('Shelter', ShelterSchema);

// ===== 内存存储（数据库未连接时作为降级方案）=====
const users: any = {};
const shelters: any = {};

// ===== 工具函数 =====
async function getOrCreateUser(userId: string) {
  if (isDbConnected) {
    let user = await User.findOne({ userId });
    if (!user) {
      user = new User(createDefaultUser(userId));
      await user.save();
    }
    return user;
  }
  // 内存降级
  if (!users[userId]) {
    users[userId] = createDefaultUser(userId);
  }
  return users[userId];
}

async function getOrCreateShelter(roomId: string) {
  if (isDbConnected) {
    let shelter = await Shelter.findOne({ roomId });
    if (!shelter) {
      shelter = new Shelter(createDefaultShelter(roomId));
      await shelter.save();
    }
    return shelter;
  }
  if (!shelters[roomId]) {
    shelters[roomId] = createDefaultShelter(roomId);
  }
  return shelters[roomId];
}

// ===== 健康检查 =====
router.get('/health', ctx => {
  ctx.body = { status: 'ok', db: isDbConnected ? 'connected' : 'memory' };
});

// ===== 测试接口 =====
router.get('/api/ping', async ctx => {
  ctx.body = { code: 0, message: 'pong', data: { serverTime: new Date().toISOString() } };
});

// ===== 登录接口 =====
router.post('/api/login', async ctx => {
  const body: any = ctx.request.body;
  const userId = body.userId || 'user_' + Date.now();
  const roomId = body.roomId || 'default_room';

  const user = await getOrCreateUser(userId);
  const shelter = await getOrCreateShelter(roomId);

  if (!shelter.members.includes(userId)) {
    shelter.members.push(userId);
    if (isDbConnected) {
      await shelter.save();
    }
  }

  ctx.body = {
    code: 0,
    message: '登录成功',
    data: {
      userId: user.userId,
      nickname: user.nickname,
      level: user.level,
      exp: user.exp,
      power: user.power,
      ability: user.ability,
      vipLevel: user.vipLevel,
      diamonds: user.diamonds,
      shelterId: shelter.shelterId,
      roomId: shelter.roomId
    }
  };
});

// ===== 获取避难所信息 =====
router.get('/api/getShelterInfo', async ctx => {
  const roomId = ctx.query.roomId as string;
  if (!roomId) {
    ctx.status = 400;
    ctx.body = { code: -1, message: 'roomId 不能为空' };
    return;
  }

  const shelter = await getOrCreateShelter(roomId);
  const memberList = shelter.members.map((uid: string) => ({
    userId: uid,
    nickname: `幸存者_${uid.slice(-4)}`,
    level: 1
  }));

  ctx.body = {
    code: 0,
    data: {
      shelterId: shelter.shelterId,
      roomId: shelter.roomId,
      level: shelter.level,
      exp: shelter.exp || 0,
      members: memberList,
      memberCount: shelter.members.length,
      resources: shelter.resources,
      storageMax: shelter.storageMax,
      npcCount: shelter.npcCount || 0,
      defenseWeapons: shelter.defenseWeapons || []
    }
  };
});

// ===== 搜索地图 =====
router.post('/api/searchMap', async ctx => {
  const body: any = ctx.request.body;
  const { mapName, roomId } = body;

  if (!mapName) {
    ctx.status = 400;
    ctx.body = { code: -1, message: 'mapName 不能为空' };
    return;
  }

  const rewards = {
    food: Math.floor(Math.random() * 30) + 10,
    water: Math.floor(Math.random() * 20) + 5,
    exp: Math.floor(Math.random() * 20) + 10
  };

  if (roomId) {
    const shelter = await getOrCreateShelter(roomId);
    shelter.resources.food += rewards.food;
    shelter.resources.water += rewards.water;
    shelter.resources.medicine += Math.floor(Math.random() * 5);
    shelter.resources.money += Math.floor(Math.random() * 10) + 1;
    shelter.exp = (shelter.exp || 0) + rewards.exp;

    if (shelter.exp >= shelter.level * 100) {
      shelter.level += 1;
      shelter.exp = 0;
      console.log(`🎉 避难所 ${roomId} 升级到 Lv.${shelter.level}`);
    }

    if (isDbConnected) {
      await shelter.save();
    }
  }

  ctx.body = {
    code: 0,
    message: `搜索 ${mapName} 完成`,
    data: { mapName, rewards, cooldown: 1800 }
  };
});

// ===== 扣1加入 =====
router.post('/api/joinShelter', async ctx => {
  const body: any = ctx.request.body;
  const { userId, roomId } = body;

  if (!userId || !roomId) {
    ctx.status = 400;
    ctx.body = { code: -1, message: 'userId 和 roomId 不能为空' };
    return;
  }

  const user = await getOrCreateUser(userId);
  const shelter = await getOrCreateShelter(roomId);

  if (!shelter.members.includes(userId)) {
    shelter.members.push(userId);
    if (isDbConnected) {
      await shelter.save();
    }
  }

  ctx.body = {
    code: 0,
    message: '加入避难所成功',
    data: {
      shelterId: shelter.shelterId,
      roomId: shelter.roomId,
      memberCount: shelter.members.length
    }
  };
});

// ===== 排行榜 =====
router.get('/api/getRanking', async ctx => {
  const type = ctx.query.type || 'level';

  let list: any[] = [];
  if (isDbConnected) {
    const allUsers = await User.find().sort({ level: -1 }).limit(10);
    list = allUsers.map((u, index) => ({
      rank: index + 1,
      nickname: u.nickname,
      score: 'Lv.' + u.level
    }));
  } else {
    const allUsers = Object.values(users);
    list = allUsers
      .sort((a: any, b: any) => b.level - a.level)
      .slice(0, 10)
      .map((u: any, index: number) => ({
        rank: index + 1,
        nickname: u.nickname,
        score: 'Lv.' + u.level
      }));
  }

  ctx.body = { code: 0, data: { type, list } };
});

// ===== 获取避难所成员 =====
router.get('/api/getShelterMembers', async ctx => {
  const roomId = ctx.query.roomId as string;
  if (!roomId) {
    ctx.status = 400;
    ctx.body = { code: -1, message: 'roomId 不能为空' };
    return;
  }

  const shelter = await getOrCreateShelter(roomId);
  const memberList = shelter.members.map((uid: string) => ({
    userId: uid,
    nickname: `幸存者_${uid.slice(-4)}`,
    level: 1,
    x: Math.floor(Math.random() * 300) + 50,
    y: Math.floor(Math.random() * 300) + 50
  }));

  ctx.body = {
    code: 0,
    data: { roomId, members: memberList, total: memberList.length }
  };
});

// ===== 领取离线收益 =====
router.post('/api/claimOfflineRewards', async ctx => {
  const body: any = ctx.request.body;
  const { roomId, food, water } = body;

  if (!roomId) {
    ctx.status = 400;
    ctx.body = { code: -1, message: 'roomId 不能为空' };
    return;
  }

  const shelter = await getOrCreateShelter(roomId);
  shelter.resources.food += food || 0;
  shelter.resources.water += water || 0;

  if (isDbConnected) {
    await shelter.save();
  }

  ctx.body = {
    code: 0,
    message: '领取离线收益成功',
    data: { food: shelter.resources.food, water: shelter.resources.water }
  };
});

// ===== 启动服务 =====
app.use(bodyParser());
app.use(router.routes());

const PORT = 8000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`✅ 服务器已启动，端口: ${PORT}`);
    console.log(`📊 数据库状态: ${isDbConnected ? '已连接' : '内存模式'}`);
  });
});

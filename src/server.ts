import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import Router from '@koa/router';

const app = new Koa();
const router = new Router();

// ========== 内存存储 ==========
const users: any = {};
const shelters: any = {};

console.log("🚀 避难所游戏后端启动（内存版 - 支持多房间）");

// ============================================================
// 1. 健康检查
// ============================================================
router.get('/health', ctx => {
    ctx.status = 200;
    ctx.body = 'OK';
});

// ============================================================
// 2. 根路径
// ============================================================
router.get('/', ctx => {
    ctx.body = `🎮 避难所游戏后端运行中 (多房间版)`;
});

// ============================================================
// 3. 测试接口
// ============================================================
router.get('/api/ping', async (ctx) => {
    ctx.body = {
        code: 0,
        message: 'pong',
        data: {
            serverTime: new Date().toISOString(),
            status: '游戏后端运行正常 ✅'
        }
    };
});

// ============================================================
// 4. 🎮 登录接口（带 roomId）
// ============================================================
router.post('/api/login', async (ctx) => {
    const body: any = ctx.request.body;
    const userId = body.userId || 'user_' + Date.now();
    const roomId = body.roomId || 'default_room';

    if (!users[userId]) {
        users[userId] = {
            userId: userId,
            nickname: `幸存者_${userId.slice(-4)}`,
            level: 1,
            exp: 0,
            ability: '无',
            shelterId: null,
            roomId: roomId,
            resources: { food: 0, water: 0, medicine: 0, money: 0 },
            defenseScore: 0,
            lastLoginTime: new Date()
        };
        console.log(`✅ 新用户创建: ${userId}, roomId: ${roomId}`);
    } else {
        users[userId].lastLoginTime = new Date();
        users[userId].roomId = roomId;
        console.log(`✅ 用户登录: ${userId}, roomId: ${roomId}`);
    }

    if (!shelters[roomId]) {
        shelters[roomId] = {
            shelterId: 'shelter_' + roomId,
            roomId: roomId,
            level: 1,
            exp: 0,
            members: [],
            resources: {
                food: 100,
                water: 80,
                medicine: 20,
                money: 50
            },
            storageMax: 500,
            npcCount: 0,
            defenseWeapons: [],
            createdAt: new Date()
        };
        console.log(`✅ 新避难所创建: roomId=${roomId}`);
    }

    if (!shelters[roomId].members.includes(userId)) {
        shelters[roomId].members.push(userId);
        users[userId].shelterId = shelters[roomId].shelterId;
        console.log(`✅ 用户 ${userId} 加入避难所 ${roomId}`);
    }

    ctx.body = {
        code: 0,
        message: '登录成功',
        data: {
            userId: users[userId].userId,
            nickname: users[userId].nickname,
            level: users[userId].level,
            exp: users[userId].exp,
            ability: users[userId].ability,
            shelterId: users[userId].shelterId,
            roomId: roomId
        }
    };
});

// ============================================================
// 5. 🎮 获取避难所信息（含成员列表）
// ============================================================
router.get('/api/getShelterInfo', async (ctx) => {
    const roomId = ctx.query.roomId as string;

    if (!roomId) {
        ctx.status = 400;
        ctx.body = { code: -1, message: 'roomId 不能为空' };
        return;
    }

    const shelter = shelters[roomId];

    if (!shelter) {
        ctx.status = 404;
        ctx.body = { code: -1, message: '避难所不存在' };
        return;
    }

    const memberList = shelter.members.map((uid: string) => {
        const u = users[uid];
        return {
            userId: uid,
            nickname: u ? u.nickname : '未知幸存者',
            level: u ? u.level : 1
        };
    });

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
            npcCount: shelter.npcCount,
            defenseWeapons: shelter.defenseWeapons
        }
    };
});

// ============================================================
// 6. 🎮 加入避难所（扣1加入）
// ============================================================
router.post('/api/joinShelter', async (ctx) => {
    const body: any = ctx.request.body;
    const { userId, roomId } = body;

    if (!userId || !roomId) {
        ctx.status = 400;
        ctx.body = { code: -1, message: 'userId 和 roomId 不能为空' };
        return;
    }

    if (!users[userId]) {
        ctx.status = 404;
        ctx.body = { code: -1, message: '用户不存在，请先登录' };
        return;
    }

    if (!shelters[roomId]) {
        shelters[roomId] = {
            shelterId: 'shelter_' + roomId,
            roomId: roomId,
            level: 1,
            exp: 0,
            members: [],
            resources: {
                food: 100,
                water: 80,
                medicine: 20,
                money: 50
            },
            storageMax: 500,
            npcCount: 0,
            defenseWeapons: [],
            createdAt: new Date()
        };
        console.log(`✅ 新避难所创建: roomId=${roomId}`);
    }

    if (!shelters[roomId].members.includes(userId)) {
        shelters[roomId].members.push(userId);
        users[userId].shelterId = shelters[roomId].shelterId;
        console.log(`✅ 用户 ${userId} 通过扣1加入避难所 ${roomId}`);
    }

    ctx.body = {
        code: 0,
        message: '加入避难所成功',
        data: {
            shelterId: shelters[roomId].shelterId,
            roomId: roomId,
            memberCount: shelters[roomId].members.length
        }
    };
});

// ============================================================
// 7. 🎮 搜索地图
// ============================================================
router.post('/api/searchMap', async (ctx) => {
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

    if (roomId && shelters[roomId]) {
        shelters[roomId].resources.food += rewards.food;
        shelters[roomId].resources.water += rewards.water;
        shelters[roomId].resources.medicine += Math.floor(Math.random() * 5);
        shelters[roomId].resources.money += Math.floor(Math.random() * 10) + 1;
        shelters[roomId].exp = (shelters[roomId].exp || 0) + rewards.exp;
        
        // 升级逻辑：每100经验升1级
        if (shelters[roomId].exp >= shelters[roomId].level * 100) {
            shelters[roomId].level += 1;
            shelters[roomId].exp = 0;
            console.log(`🎉 避难所 ${roomId} 升级到 Lv.${shelters[roomId].level}`);
        }
    }

    ctx.body = {
        code: 0,
        message: `搜索 ${mapName} 完成`,
        data: {
            mapName,
            rewards,
            cooldown: 1800
        }
    };
});

// ============================================================
// 8. 🎮 多维度排行榜
// ============================================================
router.get('/api/getRanking', async (ctx) => {
    const type = ctx.query.type || 'level';
    const allUsers = Object.values(users);
    let sorted: any[] = [];
    
    if (type === 'level') {
        sorted = allUsers
            .sort((a: any, b: any) => b.level - a.level)
            .slice(0, 10)
            .map((u: any, index: number) => ({
                rank: index + 1,
                nickname: u.nickname,
                score: 'Lv.' + u.level
            }));
    } else if (type === 'resource') {
        sorted = allUsers
            .sort((a: any, b: any) => {
                const totalA = a.resources ? a.resources.food + a.resources.water + a.resources.money : 0;
                const totalB = b.resources ? b.resources.food + b.resources.water + b.resources.money : 0;
                return totalB - totalA;
            })
            .slice(0, 10)
            .map((u: any, index: number) => {
                const total = u.resources ? u.resources.food + u.resources.water + u.resources.money : 0;
                return { rank: index + 1, nickname: u.nickname, score: total + '物资' };
            });
    } else if (type === 'defense') {
        sorted = allUsers
            .sort((a: any, b: any) => {
                const defA = a.defenseScore || 0;
                const defB = b.defenseScore || 0;
                return defB - defA;
            })
            .slice(0, 10)
            .map((u: any, index: number) => {
                const score = u.defenseScore || 0;
                return { rank: index + 1, nickname: u.nickname, score: score + '分' };
            });
    }

    ctx.body = {
        code: 0,
        data: {
            type: type,
            list: sorted
        }
    };
});

// ============================================================
// 9. 🎮 获取避难所成员
// ============================================================
router.get('/api/getShelterMembers', async (ctx) => {
    const roomId = ctx.query.roomId as string;

    if (!roomId) {
        ctx.status = 400;
        ctx.body = { code: -1, message: 'roomId 不能为空' };
        return;
    }

    const shelter = shelters[roomId];
    if (!shelter) {
        ctx.status = 404;
        ctx.body = { code: -1, message: '避难所不存在' };
        return;
    }

    const memberList = shelter.members.map((uid: string) => {
        const u = users[uid];
        return {
            userId: uid,
            nickname: u ? u.nickname : '未知幸存者',
            level: u ? u.level : 1,
            x: Math.floor(Math.random() * 300) + 50,
            y: Math.floor(Math.random() * 300) + 50
        };
    });

    ctx.body = {
        code: 0,
        data: {
            roomId: roomId,
            members: memberList,
            total: memberList.length
        }
    };
});

// ============================================================
// 10. 🎮 领取离线收益
// ============================================================
router.post('/api/claimOfflineRewards', async (ctx) => {
    const body: any = ctx.request.body;
    const { roomId, food, water } = body;

    if (!roomId) {
        ctx.status = 400;
        ctx.body = { code: -1, message: 'roomId 不能为空' };
        return;
    }

    if (!shelters[roomId]) {
        ctx.status = 404;
        ctx.body = { code: -1, message: '避难所不存在' };
        return;
    }

    shelters[roomId].resources.food += food || 0;
    shelters[roomId].resources.water += water || 0;

    ctx.body = {
        code: 0,
        message: '领取离线收益成功',
        data: {
            food: shelters[roomId].resources.food,
            water: shelters[roomId].resources.water
        }
    };
});

// ============================================================
// 应用中间件和路由
// ============================================================
app.use(bodyParser());
app.use(router.routes());

const PORT = 8000;
app.listen(PORT, () => {
    console.log(`✅ 避难所游戏后端已启动，端口: ${PORT}`);
    console.log(`📊 当前: ${Object.keys(users).length} 个用户, ${Object.keys(shelters).length} 个避难所`);
});

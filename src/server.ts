import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import Router from '@koa/router';

const app = new Koa();
const router = new Router();

console.log("🚀 避难所游戏后端启动（无数据库依赖 - 模拟模式）");

// ============================================================
// 1. 健康检查接口（给抖音云用的，必须要有）
// ============================================================
router.get('/health', ctx => {
    ctx.status = 200;
    ctx.body = 'OK';
});

// ============================================================
// 2. 根路径
// ============================================================
router.get('/', ctx => {
    ctx.body = `🎮 避难所游戏后端运行中`;
});

// ============================================================
// 3. 🎮 游戏接口
// ============================================================

// 3.1 测试接口 - 检查后端是否运行正常
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

// 3.2 登录接口（模拟版）
router.post('/api/login', async (ctx) => {
    const body: any = ctx.request.body;
    const userId = body.userId || 'user_' + Date.now();
    ctx.body = {
        code: 0,
        message: '登录成功',
        data: {
            userId: userId,
            nickname: `幸存者_${userId.slice(-4)}`,
            level: 1,
            exp: 0,
            ability: '无',
            shelterId: null
        }
    };
});

// 3.3 加入避难所接口（模拟版）
router.post('/api/joinShelter', async (ctx) => {
    const body: any = ctx.request.body;
    const { roomId } = body;
    if (!roomId) {
        ctx.status = 400;
        ctx.body = { code: -1, message: 'roomId 不能为空' };
        return;
    }
    ctx.body = {
        code: 0,
        message: '加入避难所成功',
        data: {
            shelterId: 'shelter_' + Date.now(),
            roomId: roomId,
            level: 1,
            members: ['幸存者_' + Date.now().toString().slice(-4)],
            food: 100,
            water: 80,
            medicine: 20,
            money: 50
        }
    };
});

// 3.4 搜索地图接口（模拟版）
router.post('/api/searchMap', async (ctx) => {
    const body: any = ctx.request.body;
    const { mapName } = body;
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

// 3.5 获取避难所信息接口（模拟版）
router.get('/api/getShelterInfo', async (ctx) => {
    ctx.body = {
        code: 0,
        data: {
            shelterId: 'shelter_001',
            level: 2,
            members: ['幸存者A', '幸存者B', '幸存者C'],
            resources: {
                food: 350,
                water: 280,
                medicine: 45,
                money: 120
            },
            storageMax: 500,
            npcCount: 1,
            defenseWeapons: ['木棍', '铁栅栏']
        }
    };
});

// 3.6 获取排行榜接口（模拟版）
router.get('/api/getRanking', async (ctx) => {
    ctx.body = {
        code: 0,
        data: {
            type: '等级榜',
            list: [
                { rank: 1, nickname: '大佬A', level: 10 },
                { rank: 2, nickname: '大佬B', level: 9 },
                { rank: 3, nickname: '幸存者C', level: 8 }
            ]
        }
    };
});

// ============================================================
// 4. 应用中间件和路由
// ============================================================
app.use(bodyParser());
app.use(router.routes());

const PORT = 8000;
app.listen(PORT, () => {
    console.log(`✅ 避难所游戏后端已启动，端口: ${PORT}`);
});

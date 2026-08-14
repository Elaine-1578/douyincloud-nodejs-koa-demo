import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import Router from '@koa/router'
import Redis from 'ioredis';
import mongoose from 'mongoose';
import assert from "assert";

// 初始化各服务的连接 redis, mongo
async function initService() {
    const {REDIS_ADDRESS, REDIS_USERNAME, REDIS_PASSWORD, MONGO_ADDRESS, MONGO_USERNAME, MONGO_PASSWORD} = process.env;
    const [ REDIS_HOST, REDIS_PORT] = REDIS_ADDRESS.split(':');
    const redis = new Redis({
        port: parseInt(REDIS_PORT, 10),
        host: REDIS_HOST,
        username: REDIS_USERNAME,
        password: REDIS_PASSWORD,
        db: 0,
    });

    assert(await redis.echo('echo') === 'echo', `redis echo error`);

    const mongoUrl = `mongodb://${MONGO_USERNAME}:${encodeURIComponent(MONGO_PASSWORD)}@${MONGO_ADDRESS}`;
    await mongoose.connect(mongoUrl);    

    return {
        redis,
        mongoose,
    }
}

initService().then(async ({ redis, mongoose}) => {
    const kittySchema = new mongoose.Schema({
        name: String
    });

    const Kitten = mongoose.model('Kitten', kittySchema);

    const app = new Koa();

    const router = new Router();
router
    // ===== 原有接口 =====
    .get('/', ctx => {
        ctx.body = `Nodejs koa demo project`;
    })
    .get('/api/get_data_from_redis', async(ctx) => {
        const key = ctx.query.key as string;
        assert(key?.trim(), `key is required`);
        const value = await redis.get(key);
        if (value) {
            ctx.body = {
                success: true,
                data: value,
            }
        } else {
            ctx.status = 404;
            ctx.body = {
                success: false,
                message: `${key} not exist`,
            }
        }
    })
    .post('/api/set_data_to_redis', async(ctx) => {
        const key = ctx.query.key as string;
        const body: any = ctx.request.body;
        const value = body.value as string;
        assert(key?.trim(), `key is required`);
        assert(value?.trim(), `value is required`);
        await redis.set(key, value);
        ctx.body = {
            success: true,
        }
    })
    .get('/api/get_data_from_mongodb', async(ctx) => {
        const name = ctx.query.name as string;
        assert(name?.trim(), `name is required`);
        const data = await Kitten.findOne({ name });
        if (data) {
            ctx.body = {
                success: true,
                data: data.toJSON(),
            }
        } else {
            ctx.status = 404;
            ctx.body = {
                success: false,
                message: `${name} not exist`,
            }
        }
    })
    .post('/api/set_data_to_mongodb', async(ctx) => {
        const name = ctx.query.name as string;
        assert(name?.trim(), `name is required`);
        const kit = new Kitten({ name });
        await kit.save();
        ctx.body = {
            success: true,
        }
    })

    // ===== 🎮 避难所游戏接口（新增） =====
    .get('/api/ping', async (ctx) => {
        ctx.body = {
            code: 0,
            message: 'pong',
            data: {
                serverTime: new Date().toISOString(),
                status: '游戏后端运行正常 ✅'
            }
        };
    })
    .post('/api/login', async (ctx) => {
        ctx.body = {
            code: 0,
            message: '登录成功',
            data: {
                userId: 'test_user_001',
                nickname: '幸存者',
                level: 1,
                shelterId: null
            }
        };
    })
    .post('/api/joinShelter', async (ctx) => {
        const body: any = ctx.request.body;
        const { roomId } = body;
        if (!roomId) {
            ctx.status = 400;
            ctx.body = {
                code: -1,
                message: 'roomId 不能为空'
            };
            return;
        }
        ctx.body = {
            code: 0,
            message: '加入避难所成功',
            data: {
                shelterId: 'shelter_001',
                roomId: roomId,
                level: 1,
                members: ['test_user_001'],
                food: 100,
                water: 80,
                medicine: 20,
                money: 50
            }
        };
    })
    .post('/api/searchMap', async (ctx) => {
        const body: any = ctx.request.body;
        const { mapName } = body;
        if (!mapName) {
            ctx.status = 400;
            ctx.body = {
                code: -1,
                message: 'mapName 不能为空'
            };
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
    })
    .get('/api/getShelterInfo', async (ctx) => {
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

    app.use(bodyParser());
    app.use(router.routes());

    const PORT = 8000;
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });

}).catch((error: string) => console.log("Init service  error: ", error));

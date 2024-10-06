import { createClient } from 'redis';

// Redis 클라이언트 생성
const redisClient = createClient();

redisClient.on('error', (err) => {
    console.error('Redis connection error:', err);
});

// Redis 연결
async function connectRedis() {
    try {
        await redisClient.connect();
        console.log('Redis에 연결되었습니다.');
    } catch (error) {
        console.error('Redis 연결 실패:', error);
    }
}

export { redisClient, connectRedis };

import { createClient } from "redis";
import { getGameAssets } from "./assets.js";

// Redis 클라이언트 생성
const redisClient = createClient();

redisClient.on("error", (err) => {
  console.error("Redis connection error:", err);
});

// Redis 연결
async function connectRedis() {
  try {
    await redisClient.connect();
    console.log("Redis에 연결되었습니다.");
  } catch (error) {
    console.error("Redis 연결 실패:", error);
  }
}

// redis에 저장
async function setRedisKey(key, value) {
  try {
    await redisClient.set(key, value);
    console.log(`Redis에 ${key}: ${value} 저장됨.`);
  } catch (error) {
    console.error("Redis에 데이터 저장 중 오류 발생:", error);
  }
}

// redis에 저장된 거 조회
async function getRedisKey(key) {
  try {
    const value = await redisClient.get(key);
    console.log(`Redis에서 조회된 값: ${value}`);
    return value;
  } catch (error) {
    console.error("Redis에서 데이터 조회 중 오류 발생:", error);
  }
}

// redis에 저장된거면 조회 없으면 저장
async function fetchDataWithCache(key) {
  const cachedValue = await getRedisKey(key);

  if (cachedValue) {
    console.log("캐시된 데이터 사용");
    return JSON.parse(cachedValue); // 캐시된 값 반환
  }

  // 캐시에 데이터가 없으면 DB에서 가져옴
  const gameAssets = getGameAssets();

  // Redis에 저장
  await setRedisKey(key, JSON.stringify(dbValue));

  return dbValue;
}

async function saveScore(userId, score) {
    try {
        const savescore = parseFloat(score);
        await redisClient.zAdd('userScores', { score: savescore, value: userId });
        console.log(`사용자 ${userId}의 점수 ${savescore}가 저장되었습니다.`);
    } catch (error) {
        console.error('점수 저장 중 오류 발생:', error);
    }
}

async function getTopUsers(count) {
    try {
        const topUsers = await redisClient.zRangeWithScores('userScores', -count, -1, { REV: true });
        console.log('상위 사용자:', topUsers);
        return topUsers;
    } catch (error) {
        console.error('점수 조회 중 오류 발생:', error);
    }
}

async function keepTop3Users() {
    try {
        // 상위 3명만 남기고 그 아래의 사용자 삭제
        await redisClient.zRemRangeByRank('userScores', 3, -1);
        console.log('상위 3명 이외의 사용자 삭제 완료');
    } catch (error) {
        console.error('사용자 삭제 중 오류 발생:', error);
    }
}

async function disconnectRedis() {
  try {
    await redisClient.quit();
    console.log("Redis 연결 종료됨.");
  } catch (error) {
    console.error("Redis 연결 종료 실패:", error);
  }
}

export { redisClient, connectRedis, saveScore };

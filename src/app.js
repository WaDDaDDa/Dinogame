import express from 'express';
import { createServer } from 'http';
import initSocket from './init/socket.js';
import { loadGameAssets } from './init/assets.js';
import { connectRedis } from './init/redis.js';

const app = express();
const server = createServer(app);

const PORT = 3000;

app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
initSocket(server); // 소켓 추가.

app.get('/', (req, res) => { // 테스트를 위한 API 생성
  res.send('<h1>Hello World</h1>');
});

server.listen(PORT, async () => {
  console.log(`Server is running on port ${PORT}`);

  // 여기서 파일 읽음
  try {
    const assets = await loadGameAssets();
    console.log(assets);
    console.log("Assets loded successfully");
  } catch (err) {
    console.log("Failed to load game assets", err);
  }

    // 여기서 redis
    try {
      await connectRedis();
      console.log("Redis 연결 완료.");
    } catch (err) {
      console.log("Failed to Redis", err);
    }
});
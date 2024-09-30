import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// 현재 파일의 절대 경로를 나타낸다. import.meta.url
// import.meta.url은 현재 파일의 URL을 나타냅니다. 이를 fileURLToPath() 함수로 파일 경로로 변환하여 __filename에 저장합니다. 결과적으로, 현재 파일의 절대 경로(파일명 포함)를 나타냅니다.
const __filename = fileURLToPath(import.meta.url);
// 파일 이름 빼고 디렉토리 경로만을 나타낸다.
// path.dirname(__filename)은 위에서 얻은 파일 경로에서 디렉토리 경로만을 추출하여 __dirname에 저장합니다. 즉, 현재 파일이 속한 디렉토리 경로를 나타냅니다.
const __dirname = path.dirname(__filename);
// 현재 경로에서 두단계 상위로 올라가서 assets에 접근 assets 디렉토리의 절대 경로를 의미한다.
// __filename = src/init/assets.js => __dirname = src/init => 상위디렉토리 src => 상위 디렉토리 (루트) => 에서 assets
const basePath = path.join(__dirname, "../../assets");

// 전역 변수로 선언
let gameAssets = {};

// 파일 읽는 함수
// 비동기 병렬로 파일을 읽는다.
const readFileAsync = (filename) => {
  return new Promise((resolve, reject) => {
    fs.readFile(path.join(basePath, filename), "utf8", (err, data) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(JSON.parse(data));
    });
  });
};

// Promise.all()
export const loadGameAssets = async () => {
  try {
    const [stages, items, itemUnlocks] = await Promise.all([
      readFileAsync("stage.json"),
      readFileAsync("item.json"),
      readFileAsync("item_unlock.json"),
    ]);

    gameAssets = { stages, items, itemUnlocks };
    return gameAssets;
  } catch (err) {
    throw new Error("Failed to load game assets" + err.message);
  }
};



export const getGameAssets = () => {
  return gameAssets;
};

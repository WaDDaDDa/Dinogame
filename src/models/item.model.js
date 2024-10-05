import { getGameAssets } from "../init/assets.js";

// 스테이지 정보를 객체에 {key: uuid, value: array}의 형태로 uuid를 Key로 저장합니다.
const items = {};

export const createItems = (uuid) => {
  items[uuid] = []; // 초기 스테이지 배열 생성
};

export const getItems = (uuid) => {
  return items[uuid];
};

// items = 여태 먹은 아이템 총합
export const setItems = (uuid, score) => {
  return items[uuid].push({ score });
};

export const addItems = (uuid, itemId) => {
  const { items: itemtable } = getGameAssets();
  const addscore = itemtable.data.find((item) => item.id === itemId).score;
  console.log(`addscore: ${addscore}`);
    return items[uuid][0].score += addscore;
}

export const clearItems = (uuid) => {
  items[uuid] = [];
};

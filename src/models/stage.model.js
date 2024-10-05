// 스테이지 정보를 객체에 {key: uuid, value: array}의 형태로 uuid를 Key로 저장합니다.
// value:array 에는 stageId를 가진 객체가 들어갑니다.
const stages = {};

export const createStage = (uuid) => {
  stages[uuid] = []; // 초기 스테이지 배열 생성
};

export const getStage = (uuid) => {
  return stages[uuid];
};

// stage = 아이디, 스테이지 교체된 시간, 스테이지 초당 획득 점수, 이 스테이지까지 걸린 시간
export const setStage = (uuid, id, timestamp, addscore, curscore) => {
  stages[uuid].push({ id, timestamp, addscore, curscore });
  console.log(`최근 스테이지 : ${stages[uuid][stages.length - 1]}`);

};

export const clearStage = (uuid) => {
  stages[uuid] = [];
};
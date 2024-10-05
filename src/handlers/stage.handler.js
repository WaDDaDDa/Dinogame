import { getStage, setStage } from "../models/stage.model.js";
import { getGameAssets } from "../init/assets.js";
import { getItems } from "../models/item.model.js";

export const moveStageHandler = (userId, payload) => {
  // 유저의 현재 스테이지 배열을 가져오고, 최대 스테이지 ID를 찾는다.
  let currentStages = getStage(userId);
  console.log(currentStages);
  if (!currentStages.length) {
    return { status: "fail", message: "No stages found for user" };
  }

  // 오름차순 정렬 후 가장 큰 스테이지 ID 확인 = 가장 상위의 스테이지 = 현재 스테이지
  currentStages.sort((a, b) => a.id - b.id);
  const currentStage = currentStages[currentStages.length - 1];

  // payload 의 currentStage 와 비교
  // id랑 스테이지랑 비교?
  // 클라이언트 vs 서버 비교
  if (currentStage.id !== payload.currentStage) {
    return { status: "fail", message: "Current stage mismatch" };
  }

  // 점수 검증
  const serverTime = Date.now(); // 현재 시간
  let elapsedScore = (serverTime - currentStage.timestamp) / 1000 * currentStage.addscore + currentStage.curscore; // 소요시간에 따른 점수.
  // + 아이템 획득에 따른 점수도 계산이 되어야함.
  const itemsScore = getItems(userId)[0].score;
  elapsedScore += itemsScore;

  const { stages } = getGameAssets();
  const nextStageScore = stages.data.find((stage) => stage.id === currentStage.id + 1).score;

  // 소요 시간을 가지고 점수를 산정하는 방식. 아이템 획득으로 점수가 증가한것은 고려되지 않음.
  const scoreInter = Math.abs(payload.curScore - elapsedScore);
  if (!(elapsedScore > nextStageScore - 0.25 &&  scoreInter > 0 && scoreInter < 0.25)) {
    return { status: "fail", message: `Invalud elapsed time : ${elapsedScore}, serverTime : ${items.score}, timestamp: ${payload.curScore}` };
  }



  // 게임 에셋에서 다음 스테이지의 존재 여부 확인
  if (!stages.data.some((stage) => stage.id === payload.targetStage)) {
    return { status: "fail", message: "Target stage not found" };
  }

  elapsedScore -= itemsScore;

  // 유저의 스테이지 정보 업데이트
  const nextAddScore = stages.data.find((stage) => stage.id === currentStage.id + 1).addscore;
  setStage(userId, payload.targetStage, serverTime, nextAddScore, elapsedScore);
  console.log(`CurStage : ${currentStage.id + 1} `);
  return { status: "success", message: `elapsed time : ${elapsedScore}, serverTime : ${nextStageScore}` };
};
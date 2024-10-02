import { getGameAssets } from "../init/assets.js";
import { getStage, setStage, clearStage } from "../models/stage.model.js";

export const gameStart = (userUUID, payload) => {
  // 서버 메모리에 있는 게임 에셋에서 stage 정보를 가지고 온다.
  const { stages } = getGameAssets();
  clearStage(userUUID);
  // stages 배열에서 0번째 = 첫번째 스테이지의 ID를 해당 유저의 stage에 저장한다.
  setStage(userUUID, stages.data[0].id, payload.timestamp);
  console.log("stage", getStage(userUUID));

  return { status: "success" };
};

export const gameEnd = (uuid, payload) => {
  // 클라이언트에서 받은 게임 종료 시 타임스탬프와 총 점수
  // 구조 분해 할당 : 붙이면 이름을 바꿔서 사용할 수 있다.
  const { timestamp: gameEndTime, score } = payload;
  const stages = getStage(uuid);

  if (!stages.length) {
    return { status: "fail", message: "No stages found for user" };
  }

  // 각 스테이지의 지속 시간을 계산하여 총 점수 계산
  let totalScore = 0;
  stages.forEach((stage, index) => {
    let stageEndTime;
    if (index === stages.length - 1) {
      // 마지막 스테이지의 경우 종료 시간이 게임의 종료 시간이다.
      stageEndTime = gameEndTime;
    } else {
      // 다음 스테이지의 시작 시간을 현재 스테이지의 종료 시간으로 사용
      stageEndTime = stages[index + 1].timestamp;
    }
    const stageDuration = (stageEndTime - stage.timestamp) / 1000;
    totalScore += stageDuration; // 1초당 1점 stage테이블에 stage별 점수증가량을 추가하여 초당 점수를 조절할 수 있다.
  });

  // 점수와 타임스탬프 검증 ( ex 클라이언트가 보낸 총점과 계산된 총점 비교)
  // 오차 범위 5 로 설정
  if (Math.abs(score - totalScore) > 5) {
    return { status: "fail", message: "Score verification failed" };
  }

  // 모든 검증이 통과된 후, 클라이언트에서 제공한 점수 저장하는 로직
  // saveGameResult(userId, clientScore, gameEndTime);
  // 검증이 완료되면 게임 종료 처리
  return { status: "success", message: "Game ended successfully", score };
};

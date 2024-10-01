import { moveStageHandler } from "./stage.handler.js";
import { gameStart, gameEnd } from "./game.handler.js";

// key 값으로 핸들러ID를 가지고 value로 함수를 가집니다.
// 이때 key로 사용되는 핸들러 ID는 임의의 숫자로 선언합니다.
// 11이라는 key 에 moveStageHandler함수를 value로 가집니다.
const handlerMappings = {
  2: gameStart,
  3: gameEnd,
  11: moveStageHandler,
};

export default handlerMappings;

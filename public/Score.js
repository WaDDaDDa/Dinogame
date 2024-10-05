import { sendEvent } from "./Socket.js";
import stages from "./assets/stage.json" with { type: 'json' };
import items from "./assets/item.json" with { type: 'json'};


class Score {
  score = 0;
  HIGH_SCORE_KEY = "highScore";
  stageChange = true;

  curStageId = 1000;
  nextStageId = 1001;
  nextStageScore = 10;
  addscore = 0;

  constructor(ctx, scaleRatio) {
    this.ctx = ctx;
    this.canvas = ctx.canvas;
    this.scaleRatio = scaleRatio;
    this.setStage();
  }

  setStage(){
    this.StageId = stages.data[0].id;
    this.nextStageId = stages.data[1].id;
    this.nextStageScore = stages.data[1].score;
    this.addscore = stages.data[0].addscore;
  }

  setNextStage(){
    this.curStageId = this.nextStageId;
    this.nextStageId = this.nextStageId + 1;
    this.addscore = stages.data.find((stage) => stage.id === this.curStageId).addscore;
    this.nextStageScore = stages.data.find((stage) => stage.id === this.nextStageId).score;
    this.stageChange = true;
  }

  update(deltaTime) {
    this.score += deltaTime * 0.001 * this.addscore;

    // 점수가 100점 이상이 될 시 서버에 메세지 전송
    if (Math.floor(this.score) >= this.nextStageScore && this.stageChange) {
      this.stageChange = false;
      sendEvent(11, { currentStage: this.curStageId, targetStage: this.nextStageId, curScore: this.score });
      this.setNextStage();
    }
  }

  getItem(itemId) {
    const addscore = items.data.find((item) => item.id === itemId).score;
    console.log(`itemScore : ${addscore}`);
    this.score += addscore;
    sendEvent(4, { itemId: itemId });
  }

  reset() {
    this.score = 0;
  }

  setHighScore() {
    const highScore = Number(localStorage.getItem(this.HIGH_SCORE_KEY));
    if (this.score > highScore) {
      localStorage.setItem(this.HIGH_SCORE_KEY, Math.floor(this.score));
    }
  }

  getScore() {
    return this.score;
  }

  draw() {
    const highScore = Number(localStorage.getItem(this.HIGH_SCORE_KEY));
    const y = 20 * this.scaleRatio;

    const fontSize = 20 * this.scaleRatio;
    this.ctx.font = `${fontSize}px serif`;
    this.ctx.fillStyle = "#525250";

    const scoreX = this.canvas.width - 75 * this.scaleRatio;
    const highScoreX = scoreX - 125 * this.scaleRatio;

    const scorePadded = Math.floor(this.score).toString().padStart(6, 0);
    const highScorePadded = highScore.toString().padStart(6, 0);

    this.ctx.fillText(scorePadded, scoreX, y);
    this.ctx.fillText(`HI ${highScorePadded}`, highScoreX, y);
  }
}

export default Score;

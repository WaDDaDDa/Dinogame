import { sendEvent } from "./Socket.js";
import stages from "./assets/stage.json" with { type: 'json' };


class Score {
  score = 0;
  HIGH_SCORE_KEY = "highScore";
  stageChange = true;
  curStageId = 1000;
  nextStageId = 1001;
  nextStageScore = 0;

  constructor(ctx, scaleRatio) {
    this.ctx = ctx;
    this.canvas = ctx.canvas;
    this.scaleRatio = scaleRatio;
    this.setNextStageScore();
  }

  setNextStageScore(){
    this.nextStageScore = stages.data.find((stage) => stage.id === this.nextStageId).score;
  }

  update(deltaTime) {
    this.score += deltaTime * 0.001;
    // 점수가 100점 이상이 될 시 서버에 메세지 전송
    if (Math.floor(this.score) === this.nextStageScore && this.stageChange) {
      this.stageChange = false;
      console.log(this.score);
      sendEvent(11, { currentStage: 1000, targetStage: 1001 });
    }
  }

  getItem(itemId) {
    this.score += 0;
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

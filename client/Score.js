import { sendEvent } from './Socket.js';

class Score {
  score = 0;
  HIGH_SCORE_KEY = 'highScore';
  stageChange = true;

  constructor(ctx, scaleRatio) {
    this.ctx = ctx;
    this.canvas = ctx.canvas;
    this.scaleRatio = scaleRatio;
  }

  update(deltaTime) {
    this.score += deltaTime * 0.001;

    // 점수가 100점 이상이 될 시 서버에 메세지 전송
    if (Math.floor(this.score) === 10 && this.stageChange) {
      this.stageChange = false;

      // 1 -> 2 스테이지로 넘어감. 나중에 수정해야함
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
    this.ctx.fillStyle = '#525250';

    const scoreX = this.canvas.width - 75 * this.scaleRatio;
    const highScoreX = scoreX - 125 * this.scaleRatio;

    const scorePadded = Math.floor(this.score).toString().padStart(6, 0);
    const highScorePadded = highScore.toString().padStart(6, 0);

    this.ctx.fillText(scorePadded, scoreX, y);
    this.ctx.fillText(`HI ${highScorePadded}`, highScoreX, y);

    // 현재 스테이지 표시
    const currentStage = Math.floor(this.score / 10) + 1; // 점수에 기반하여 현재 스테이지 계산
    const stageText = `Stage ${currentStage}`; // 스테이지 텍스트 생성
    // 중앙 위치 계산
    const stageTextWidth = this.ctx.measureText(stageText).width;
    const stageX = (this.canvas.width - stageTextWidth) / 2;

    this.ctx.fillText(stageText, stageX, y);
  }
}

export default Score;

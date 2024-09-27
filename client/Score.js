import { sendEvent } from './Socket.js';
import { getGameAssets } from './Assets.js';
import { getCurrentStage } from './Stage.js';

class Score {
  score = 0;
  HIGH_SCORE_KEY = 'highScore';
  // 스테이지 이동 중복 방지 변수
  stageChange = true;
  // 스테이지
  stages = {};
  // 유저 ID
  currentUserId = null;

  constructor(ctx, scaleRatio) {
    this.ctx = ctx;
    this.canvas = ctx.canvas;
    this.scaleRatio = scaleRatio;
  }

  // 초기화 메서드
  initialize(userId) {
    this.currentUserId = userId;
    
    const assets = getGameAssets();
    if (!assets || Object.keys(assets).length === 0) {
      console.error('Game assets not loaded yet!');
      return;
    }

    this.stages = assets.stages.data;
    console.log('Initialized Score with assets:', assets);
  }

  updateScorePerSecond() {
    const currentStageData = this.stages.find((stage) => stage.id === this.currentStage);
    this.scorePerSecond = currentStageData ? currentStageData.scorePerSecond : 1; // 초당 점수 업데이트
  }

  update(deltaTime) {
    this.score += deltaTime * 0.001;

    // 점수가 100점 이상이 될 시 서버에 메세지 전송
    if (Math.floor(this.score) >= 10 && this.stageChange) {
      // 중복 방지
      this.stageChange = false;

      // 1 -> 2 스테이지로 넘어감. 나중에 수정해야함
      sendEvent(11, { currentStage: 1000, targetStage: 1001 });

      //this.currentStageIndex++;
      //this.updateScorePerSecond();
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
    const stageText = `Stage 0`;
    // 중앙 위치 계산
    const stageTextWidth = this.ctx.measureText(stageText).width;
    const stageX = (this.canvas.width - stageTextWidth) / 2;

    this.ctx.fillText(stageText, stageX, y);
  }
}

export default Score;

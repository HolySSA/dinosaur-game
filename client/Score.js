import { sendEvent } from './Socket.js';
import { getGameAssets } from './Assets.js';
import { setCurrentStage } from './Stage.js';
import { getHighScore, setHighScore } from './HighScore.js';

// 처음 시작하면 점수 안올라가는 버그 고치기

class Score {
  score = 0;
  HIGH_SCORE_KEY = 'highScore';
  // 스테이지 이동 중복 방지 변수
  stageChange = true;
  // 스테이지
  stages = null;
  // 현재 스테이지
  currentStage = null;
  // 다음 스테이지
  nextStage = null;
  // 현재 스테이지 초당 점수
  scorePerSecond = 0;
  // 다음 스테이지 최저 점수
  nextStageScore = 0;

  constructor(ctx, scaleRatio) {
    this.ctx = ctx;
    this.canvas = ctx.canvas;
    this.scaleRatio = scaleRatio;
  }

  // 초기화 메서드
  initialize() {
    const assets = getGameAssets();
    if (!assets || Object.keys(assets).length === 0) {
      console.warn('아직 게임 에셋이 로드되지 않았습니다. 잠시 후 에셋을 불러옵니다!');
      return;
    }

    this.stages = assets.stages.data;
    if (Array.isArray(this.stages) && this.stages.length > 0) {
      //console.log('게임 에셋 불러와서 스테이지 할당:', this.stages);

      // 현재 스테이지 셋팅
      setCurrentStage(this.stages[0]);

      // 초기화
      this.currentStage = this.stages[0];
      this.nextStage = this.stages[1];
      this.scorePerSecond = this.currentStage.scorePerSecond;
      this.nextStageScore = this.nextStage.score;
      //console.log('현재 스테이지:', this.currentStage.id);
      //console.log('현재 스테이지 초당 득점:', this.scorePerSecond);
      //console.log('다음 스테이지 점수:', this.nextStageScore);
    } else {
      console.error('스테이지 데이터를 불러올 수 없습니다. this.stages:', this.stages);
      this.currentStage = null;
    }
  }

  updateCurrentStage() {
    // 현재 스테이지 인덱스
    const currentStageIndex = this.stages.findIndex((stage) => stage.id === this.currentStage.id);
    // 다음 스테이지 인덱스
    const nextStageIndex = currentStageIndex + 1;

    // 다음 스테이지 존재 시
    if (nextStageIndex < this.stages.length) {
      // 외부에서 사용할 stage 업데이트
      setCurrentStage(this.stages[nextStageIndex]);

      // 현재 스테이지 업데이트
      this.currentStage = this.stages[nextStageIndex];
      this.nextStage =
        nextStageIndex + 1 < this.stages.length ? this.stages[nextStageIndex + 1] : null;
      this.scorePerSecond = this.currentStage.scorePerSecond;
      this.nextStageScore =
        nextStageIndex + 1 < this.stages.length ? this.stages[nextStageIndex + 1].score : Infinity;

      //console.log(`현재 스테이지: ${this.currentStage.id}`);
      //console.log('현재 스테이지 초당 득점:', this.scorePerSecond);
      //console.log('다음 스테이지 점수:', this.nextStageScore);
    } else {
      // 마지막 스테이지일 경우
      console.log('더 이상 다음 스테이지가 없습니다.');
    }
  }

  update(deltaTime) {
    this.score += this.scorePerSecond * deltaTime * 0.001;

    // 다음 스테이지 점수보다 커지면 서버 측에 다음 스테이지 요청
    if (
      this.nextStageScore !== 0 &&
      Math.floor(this.score) >= this.nextStageScore &&
      this.stageChange
    ) {
      // 중복 방지
      this.stageChange = false;

      // 현재 스테이지 과거로 할당
      const recentStage = this.currentStage;
      // 현재 스테이지 업데이트
      this.updateCurrentStage();
      // 서버로 다음 스테이지 보내기 (현재 스테이지, 다음 스테이지, 현재 점수)
      sendEvent(11, {
        currentStage: recentStage,
        targetStage: this.currentStage,
        score: this.score,
      });

      this.stageChange = true;
    }
  }

  getItem(itemId) {
    const assets = getGameAssets();
    const itemsData = assets.items.data;
    const itemScore = itemsData.find((item) => item.id == itemId).score;

    console.log('itemId: ', itemId, 'itemScore: ', itemScore);
    this.score += itemScore;

    // 서버로 아이템 습득 요청 (payload: stageId, itemId, itemScore)
    sendEvent(21, { stageId: this.currentStage.id, itemId, itemScore });
  }

  reset() {
    this.score = 0;

    // 스테이지 리셋
    if (this.stages) {
      //console.log('stages: ', this.stages);

      // 외부에서 사용할 stage 업데이트
      setCurrentStage(this.stages[0]);

      this.currentStage = this.stages[0];
      this.nextStage = this.stages[1];
      this.scorePerSecond = this.currentStage.scorePerSecond;
      this.nextStageScore = this.nextStage.score;
    }
  }

  setHighScore() {
    const highScore = getHighScore();
    if (this.score > highScore) {
      setHighScore(this.score);
    }
  }

  getScore() {
    return this.score;
  }

  draw() {
    const highScore = getHighScore();
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
    if (this.currentStage) {
      const stageText = `Stage ${this.currentStage.id - 1000}`;
      // 중앙 위치 계산
      const stageTextWidth = this.ctx.measureText(stageText).width;
      const stageX = (this.canvas.width - stageTextWidth) / 2;

      this.ctx.fillText(stageText, stageX, y);
    }
  }
}

export default Score;

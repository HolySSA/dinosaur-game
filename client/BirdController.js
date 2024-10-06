import Bird from './Bird.js';

// 공룡 달리는 것처럼 새도 날개짓하는 걸로 수정
class BirdController {
  BIRD_INTERVAL_MIN = 5000;
  BIRD_INTERVAL_MAX = 10000;

  nextBirdInterval = null;
  birds = [];

  constructor(ctx, birdImages, scaleRatio, speed) {
    this.ctx = ctx;
    this.canvas = ctx.canvas;
    this.birdImages = birdImages;
    this.scaleRatio = scaleRatio;
    this.speed = speed;

    this.setNextBirdTime();
  }

  setNextBirdTime() {
    this.nextBirdInterval = this.getRandomNumber(this.BIRD_INTERVAL_MIN, this.BIRD_INTERVAL_MAX);
  }

  getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  createBird() {
    const birdImage = this.birdImages[0];
    const x = this.canvas.width * 1.5;
    const y = this.getRandomNumber(10, this.canvas.height - birdImage.height);

    const bird = new Bird(this.ctx, x, y, birdImage.width, birdImage.height, this.birdImages);

    this.birds.push(bird);
  }

  update(gameSpeed, deltaTime) {
    if (this.nextBirdInterval <= 0) {
      // 새 생성
      this.createBird();
      this.setNextBirdTime();
    }

    this.nextBirdInterval -= deltaTime;

    this.birds.forEach((bird) => {
      bird.update(this.speed, gameSpeed, deltaTime, this.scaleRatio);
    });

    // 지나간 새 삭제
    this.birds = this.birds.filter((bird) => bird.x > -bird.width);
  }

  draw() {
    this.birds.forEach((bird) => bird.draw());
  }

  collideWith(sprite) {
    return this.birds.some((bird) => bird.collideWith(sprite));
  }

  reset() {
    this.birds = [];
  }
}

export default BirdController;

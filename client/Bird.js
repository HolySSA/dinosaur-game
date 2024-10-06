class Bird {
  FLY_ANIMATION_TIMER = 200;

  constructor(ctx, x, y, width, height, birdImages) {
    this.ctx = ctx;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.birdImages = birdImages;
    this.imageIndex = 0;
    this.image = this.birdImages[this.imageIndex].image;
    this.animationTimer = this.FLY_ANIMATION_TIMER;
  }

  update(speed, gameSpeed, deltaTime, scaleRatio) {
    this.x -= speed * gameSpeed * deltaTime * scaleRatio;

    this.animationTimer -= deltaTime * gameSpeed;
    if (this.animationTimer <= 0) {
      this.imageIndex = (this.imageIndex + 1) % this.birdImages.length;
      this.image = this.birdImages[this.imageIndex].image;

      this.animationTimer = this.FLY_ANIMATION_TIMER;
    }
  }

  draw() {
    this.ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
  }

  collideWith(sprite) {
    const adjustBy = 1.4;

    // 충돌
    return (
      this.x < sprite.x + sprite.width / adjustBy &&
      this.x + this.width / adjustBy > sprite.x &&
      this.y < sprite.y + sprite.height / adjustBy &&
      this.y + this.height / adjustBy > sprite.y
    );
  }
}

export default Bird;

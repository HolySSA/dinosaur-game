import Item from './Item.js';
import { getGameAssets } from './Assets.js';
import { getCurrentStage } from './Stage.js';

class ItemController {
  INTERVAL_MIN = 0;
  INTERVAL_MAX = 12000;

  nextInterval = null;
  items = [];

  constructor(ctx, itemImages, scaleRatio, speed) {
    this.ctx = ctx;
    this.canvas = ctx.canvas;
    this.itemImages = itemImages;
    this.scaleRatio = scaleRatio;
    this.speed = speed;

    this.setNextItemTime();
  }

  setNextItemTime(itemId) {
    // respawn 시간 ~ + 10초 정도로 해서 랜덤값으로 nextInterval에 넣기
    let respawn;
    try {
      const assets = getGameAssets();
      const selectedItem = assets.items.data.find((item) => item.id === itemId);
      respawn = selectedItem.respawn;
    } catch {
      respawn = 5;
    }

    console.log('respawn: ', respawn);
    this.nextInterval = respawn * 1000;
  }

  getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  createItem() {
    const assets = getGameAssets();
    console.log('assets: ', assets);
    const currentStage = getCurrentStage();
    console.log('현재 스테이지: ', currentStage);
    const currentStageItemUnlock = assets.itemUnlocks.data.find((entry) => entry.stage_id === currentStage.id);
    const currentStageItemIds = currentStageItemUnlock ? currentStageItemUnlock.item_id : [];

    // 해금된 아이템 ID 출력
    console.log('현재 스테이지에서 해금된 아이템 ID:', currentStageItemIds);

    const index = this.getRandomNumber(0, currentStageItemIds.length - 1);
    const selectedItemId = currentStageItemIds[index];

    console.log('아이템 생성: ', selectedItemId);

    const itemInfo = this.itemImages[selectedItemId - 1];
    const x = this.canvas.width * 1.5;
    const y = this.getRandomNumber(10, this.canvas.height - itemInfo.height);

    const item = new Item(
      this.ctx,
      itemInfo.id,
      x,
      y,
      itemInfo.width,
      itemInfo.height,
      itemInfo.image,
    );

    this.items.push(item);

    return selectedItemId;
  }

  update(gameSpeed, deltaTime) {
    if (this.nextInterval <= 0) {
      const itemId = this.createItem();
      this.setNextItemTime(itemId);
    }

    this.nextInterval -= deltaTime;

    this.items.forEach((item) => {
      item.update(this.speed, gameSpeed, deltaTime, this.scaleRatio);
    });

    this.items = this.items.filter((item) => item.x > -item.width);
  }

  draw() {
    this.items.forEach((item) => item.draw());
  }

  collideWith(sprite) {
    const collidedItem = this.items.find((item) => item.collideWith(sprite));
    if (collidedItem) {
      this.ctx.clearRect(collidedItem.x, collidedItem.y, collidedItem.width, collidedItem.height);
      return {
        itemId: collidedItem.id,
      };
    }
  }

  reset() {
    this.items = [];
  }
}

export default ItemController;

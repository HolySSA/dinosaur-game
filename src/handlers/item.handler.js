import { getGameAssets } from '../init/assets.js';
import { addGotItem, getGotItems, getUnlockedItems } from '../models/item.model.js';
import { getStage } from '../models/stage.model.js';

/**
 * 아이템을 먹을 때마다 호출
 * @param userId
 * @param payload - client에서 요청한 정보
 * @returns
 */
export const getItemhandler = (userId, payload) => {
  const { items, itemUnlocks } = getGameAssets();

  let currentGotItems = getGotItems(userId);
  if (!currentGotItems) {
    return { status: 'fail', message: '해당 유저의 습득 아이템 목록을 찾을 수 없습니다.' };
  }

  // timestamp로 오름차순 정렬 후 가장 최근에 습득했던 아이템 확인
  currentGotItems.sort((a, b) => a.timestamp - b.timestamp);
  // 현재 item_unlock
  const currentGotItem = currentGotItems[currentGotItems.length - 1];

  if (!items.data.some((item) => item.id === payload.itemId)) {
    return { status: 'fail', message: '해당 아이템은 존재하지 않습니다.' };
  }

  const selectedItem = items.data.find((item) => item.id === payload.itemId);

  if (selectedItem.score !== payload.itemScore) {
    return { status: 'fail', message: '해당 아이템 점수와 획득한 점수가 일치하지 않습니다.' };
  }

  const serverTime = Date.now();
  // 아이템 respawn 검사
  const respawnTime = selectedItem.respawn;

  console.log('Item: ', selectedItem, 'respawn: ', respawnTime);

  let elapsedTime = respawnTime + 1;
  if (currentGotItem) {
    elapsedTime = (serverTime - currentGotItem.timestamp) / 1000;
  }

  if (elapsedTime <= respawnTime) {
    const remainingTime = respawnTime - elapsedTime;
    return {
      status: 'fail',
      message: `${respawnTime} - ${elapsedTime} = ${Math.ceil(remainingTime)}초 이후 아이템을 습득할 수 있습니다.`,
    };
  }

  addGotItem(userId, payload.itemId, serverTime);

  // 로그를 찍어 확인.
  console.log('GotItems:', getGotItems(userId));

  return { status: 'success', message: `${payload.itemId}번 아이템을 획득하였습니다.` };
};

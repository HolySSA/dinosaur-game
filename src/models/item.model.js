import redisClient from '../redis/redis.client.js';

const unlockedItemsKey = 'unlockedItems';
const gotItemsKey = 'gotItems';

/**
 * 스테이지별 아이템 해금
 * @param uuid - 유저 ID
 * @param stageId - 현재 스테이지 ID
 * @param itemUnlockData - 아이템 해금 데이터
 * @param timestamp - 해금된 시간
 */
export const setUnlockedItems = async (uuid, stageId, itemUnlockData) => {
  const unlockedItemsJSON = await redisClient.get(unlockedItemsKey);
  const unlockedItems = unlockedItemsJSON ? JSON.parse(unlockedItemsJSON) : {};

  if (!unlockedItems[uuid]) unlockedItems[uuid] = [];

  itemUnlockData.data.forEach((entry) => {
    if (entry.stage_id === stageId) {
      entry.item_id.forEach((itemId) => {
        if (!unlockedItems[uuid].some((item) => item.id === itemId)) {
          unlockedItems[uuid].push({ id: itemId });
        }
      });
    }
  });

  await redisClient.set(unlockedItemsKey, JSON.stringify(unlockedItems));
};

/**
 * 해금된 아이템 ID 반환
 * @param uuid - 유저 ID
 */
export const getUnlockedItems = async (uuid) => {
  const unlockedItemsJSON = await redisClient.get(unlockedItemsKey);
  const unlockedItems = unlockedItemsJSON ? JSON.parse(unlockedItemsJSON) : {};

  if (!unlockedItems[uuid]) unlockedItems[uuid] = [];

  return unlockedItems[uuid];
};

/**
 * 해금된 아이템 초기화
 * @param uuid
 */
export const clearUnlockedItems = async (uuid) => {
  const unlockedItemsJSON = await redisClient.get(unlockedItemsKey);
  const unlockedItems = unlockedItemsJSON ? JSON.parse(unlockedItemsJSON) : {};

  unlockedItems[uuid] = [];

  await redisClient.set(unlockedItemsKey, JSON.stringify(unlockedItems));
};

/**
 * 아이템 습득
 * @param uuid - 유저 ID
 * @param itemId - 습득한 아이템 ID
 * @param timestamp - 습득된 시간
 */
export const addGotItem = async (uuid, stageId, itemId, timestamp) => {
  const gotItemsJSON = await redisClient.get(gotItemsKey);
  const gotItems = gotItemsJSON ? JSON.parse(gotItemsJSON) : {};

  if (!gotItems[uuid]) gotItems[uuid] = [];

  // 해금된 아이템 목록에 해당 아이템이 있는지 확인
  const unlockedItemsList = await getUnlockedItems(uuid);
  if (unlockedItemsList.some((item) => item.id === itemId)) {
    gotItems[uuid].push({ stage: stageId, id: itemId, timestamp });
  } else {
    console.log(`fail! 현재 스테이지에서 아이템 ${itemId}는 해금되지 않았습니다.`);
  }

  await redisClient.set(gotItemsKey, JSON.stringify(gotItems));
};

/**
 * 습득한 아이템 ID 반환
 * @param uuid - 유저 ID
 */
export const getGotItems = async (uuid) => {
  const gotItemsJSON = await redisClient.get(gotItemsKey);
  const gotItems = gotItemsJSON ? JSON.parse(gotItemsJSON) : {};

  if (!gotItems[uuid]) gotItems[uuid] = [];

  return gotItems[uuid];
};

/**
 * 습득한 아이템 초기화
 * @param uuid - 유저 ID
 */
export const clearGotItems = async (uuid) => {
  const gotItemsJSON = await redisClient.get(gotItemsKey);
  const gotItems = gotItemsJSON ? JSON.parse(gotItemsJSON) : {};

  gotItems[uuid] = [];

  await redisClient.set(gotItemsKey, JSON.stringify(gotItems));
};

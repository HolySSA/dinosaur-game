let unlockedItems = {};
let gotItems = {};

/**
 * 스테이지별 아이템 해금
 * @param uuid - 유저 ID
 * @param stageId - 현재 스테이지 ID
 * @param itemUnlockData - 아이템 해금 데이터
 * @param timestamp - 해금된 시간
 */
export function setUnlockedItems(uuid, stageId, itemUnlockData) {
  if (!unlockedItems[uuid]) {
    unlockedItems[uuid] = [];
  }

  itemUnlockData.data.forEach((entry) => {
    if (entry.stage_id === stageId) {
      entry.item_id.forEach((itemId) => {
        if (!unlockedItems[uuid].some((item) => item.id === itemId)) {
          unlockedItems[uuid].push({ id: itemId });
        }
      });
    }
  });
}

/**
 * 해금된 아이템 ID 반환
 * @param uuid - 유저 ID
 */
export function getUnlockedItems(uuid) {
  return unlockedItems[uuid];
}

/**
 * 해금된 아이템 초기화
 * @param uuid
 */
export function clearUnlockedItems(uuid) {
  unlockedItems[uuid] = [];
}

/**
 * 아이템 습득
 * @param uuid - 유저 ID
 * @param itemId - 습득한 아이템 ID
 * @param timestamp - 습득된 시간
 */
export function addGotItem(uuid, itemId, timestamp) {
  if (!gotItems[uuid]) {
    gotItems[uuid] = [];
  }

  // 해금된 아이템 목록에 해당 아이템이 있는지 확인
  const unlockedItemsList = getUnlockedItems(uuid);
  if (unlockedItemsList.some((item) => item.id === itemId)) {
    gotItems[uuid].push({ id: itemId, timestamp });
  } else {
    console.log(`fail! 현재 스테이지에서 아이템 ${itemId}는 해금되지 않았습니다.`);
  }
}

/**
 * 습득한 아이템 ID 반환
 * @param uuid - 유저 ID
 */
export function getGotItems(uuid) {
  return gotItems[uuid];
}

/**
 * 습득한 아이템 초기화
 * @param uuid - 유저 ID
 */
export function clearGotItems(uuid) {
  gotItems[uuid] = [];
}
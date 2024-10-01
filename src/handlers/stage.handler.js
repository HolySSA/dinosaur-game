import { getStage, setStage } from '../models/stage.model.js';
import { getGameAssets } from '../init/assets.js';
import { setUnlockedItems, clearUnlockedItems } from '../models/item.model.js';
import { getGotItems } from '../models/item.model.js';

/**
 * 스테이지 이동 핸들러
 * @param userId
 * @param payload
 */
export const moveStageHandler = (userId, payload) => {
  // 유저의 현재 스테이지 배열을 가져오고, 최대 스테이지 ID를 찾는다.
  let currentStages = getStage(userId);
  if (!currentStages.length) {
    return { status: 'fail', message: 'No stages found for user' };
  }

  // 오름차순 정렬 후 가장 큰 스테이지 ID 확인
  currentStages.sort((a, b) => a.id - b.id);
  const currentStage = currentStages[currentStages.length - 1];

  // 클라이언트 (currentStage) vs 서버 (currentStage) 비교 로직
  if (currentStage.id !== payload.currentStage.id) {
    return { status: 'fail', message: 'Current stage mismatch' };
  }

  
  const { stages, items, itemUnlocks } = getGameAssets();

  // 점수 검증 로직
  const serverTime = Date.now();
  const elapsedTime = (serverTime - currentStage.timestamp) / 1000;
  const startScore = currentStage.score;
  const scorePerSecond = currentStage.scorePerSecond;
  const clientScore = payload.score;

  // 지금까지 습득한 아이템
  const gotItems = getGotItems(userId);
  // 지금까지 습득한 아이템 점수를 계산
  let stageItemScore = 0;
  if (gotItems.length !== 0) {
    gotItems.forEach((gotItem) => {
      if (gotItem.stage === currentStage.id) {
        const matchedItem = items.data.find((item) => item.id === gotItem.id);
        if (matchedItem) {
          stageItemScore += matchedItem.score;
        }
      }
    });
  }

  // 경과 시간(elapsedTime)에 따라 예상 점수 계산
  const expectedScore = startScore + elapsedTime * scorePerSecond + stageItemScore;

  // console.log('경과 시간 (초): ', elapsedTime);
  // console.log('스테이지 시작 점수 (startScore): ', startScore);
  // console.log('초당 점수 증가량 (scorePerSecond): ', scorePerSecond);
  // console.log('아이템 점수: ', stageItemScore);
  // console.log('클라이언트가 보낸 점수 (clientScore): ', clientScore);
  // console.log('예상 점수:', expectedScore);

  // 클라이언트 점수 vs 서버 점수 비교 (오차 5)
  const tolerance = 5;

  // 오차 범위 벗어나면 fail
  if (Math.abs(expectedScore - clientScore) > tolerance) {
    return { status: 'fail', message: 'Invalid Score' };
  }

  // 게임 에셋에서 다음 스테이지(targetStage)의 존재 여부 확인
  if (!stages.data.some((stage) => stage.id === payload.targetStage.id)) {
    return { status: 'fail', message: 'Target stage does not exist' };
  }

  // 유저의 스테이지 정보 업데이트
  setStage(
    userId,
    payload.targetStage.id,
    payload.targetStage.score,
    payload.targetStage.scorePerSecond,
    serverTime,
  );
  // 해당 스테이지 아이템 해금
  clearUnlockedItems(userId);
  setUnlockedItems(userId, payload.targetStage.id, itemUnlocks);
  // 로그를 찍어 확인.
  console.log('Stage:', getStage(userId));

  return { status: 'success', currentStage: getStage(userId).id };
};

import { getGameAssets } from '../init/assets.js';
import { getStage, setStage } from '../models/stage.model.js';
import { clearStage } from '../models/stage.model.js';
import {
  setUnlockedItems,
  clearUnlockedItems,
  getGotItems,
  clearGotItems,
} from '../models/item.model.js';
import { updateHighScore } from './score.handler.js';

/**
 * 게임 시작 함수
 * @param uuid
 * @param payload
 * @returns
 */
export const gameStart = (uuid, payload) => {
  // 서버 메모리에 있는 게임 에셋에서 stage 정보를 가지고 온다.
  const { stages, itemUnlocks } = getGameAssets();
  // 이전 스테이지 비우기
  clearStage(uuid);
  // 스테이지 별 아이템, 습득 아이템 비우기
  clearUnlockedItems(uuid);
  clearGotItems(uuid);
  // stages 배열에서 0번째 = 첫번째 스테이지 ID를 해당 유저 stage에 저장.
  setStage(
    uuid,
    stages.data[0].id,
    stages.data[0].score,
    stages.data[0].scorePerSecond,
    payload.timestamp,
  );
  // 로그를 찍어 확인.
  console.log('Stage:', getStage(uuid));
  // 첫번째 스테이지 아이템 해금
  setUnlockedItems(uuid, stages.data[0].id, itemUnlocks);

  return { status: 'success' };
};

/**
 * 게임 종료 함수
 * @param uuid
 * @param payload
 * @returns
 */
export const gameEnd = (uuid, payload) => {
  // 클라이언트에서 받은 게임 종료 시 타임스탬프와 총 점수
  const { timestamp: gameEndTime, score } = payload;
  const stages = getStage(uuid);
  const gotItems = getGotItems(uuid);

  if (!stages || !stages.length) {
    return { status: 'fail', message: 'No stages found for user' };
  }

  const { items } = getGameAssets();
  // 스테이지에서 점수 계산 로직을 수행하므로 마지막 스테이지를 이용해 총 점수만 검증
  let totalScore = 0;

  // 시간 계산 점수
  stages.forEach((stage, index) => {
    let stageEndTime;
    if (index === stages.length - 1) {
      // 마지막 스테이지의 경우 종료 시간이 게임 종료 시간
      stageEndTime = gameEndTime;
    } else {
      // 다음 스테이지의 시작 시간을 현재 스테이지의 종료 시간으로 사용
      stageEndTime = stages[index + 1].timestamp;
    }
    // 스테이지 지속 시간 (초 단위) - 1초당 1점
    const stageDuration = (stageEndTime - stage.timestamp) / 1000;
    totalScore += stageDuration * stage.scorePerSecond;
  });

  // 게임 동안 먹은 아이템 점수 합산
  let totalItemScore = 0;
  if (gotItems.length !== 0) {
    gotItems.forEach((gotItem) => {
      const matchedItem = items.data.find((item) => item.id === gotItem.id);
      if (matchedItem) {
        totalItemScore += matchedItem.score;
      }
    });
  }
  totalScore += totalItemScore;

  // 점수와 타임스탬프 검증 (ex: 클라이언트가 보낸 총점과 계산된 총점 비교)
  // 오차범위 5
  if (Math.abs(score - totalScore) > 5) {
    return { status: 'fail', message: 'Score verification failed' };
  }

  // 모든 검증 통과 후, 클라이언트에서 최고 점수 저장하는 로직
  const broadcast = updateHighScore(uuid, payload);

  if (broadcast !== null) return broadcast;
  else return { status: 'success', message: '게임 종료', score: Math.floor(score) };
};

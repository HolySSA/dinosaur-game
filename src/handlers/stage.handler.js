import { getStage, setStage } from '../models/stage.model.js';
import { getGameAssets } from '../init/assets.js';

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

  // 클라이언트 (currentStage) vs 서버 (currentStage) 비교
  if (currentStage.id !== payload.currentStage) {
    return { status: 'fail', message: 'Current stage mismatch' };
  }

  // 점수 검증 로직
  const serverTime = Date.now();
  const elapsedTime = (serverTime - currentStage.timestamp) / 1000;

  // 1초당 1점, 100점이상 다음스테이지 이동, 오차범위 5 - 클라이언트와 서버 간의 통신 지연시간을 고려해서 오차범위 설정
  // elapsedTime은 100 ~ 105 경우만 통과
  if (elapsedTime < 10 || elapsedTime > 10.5) {
    return { status: 'fail', message: 'Invalid elapsed time' };
  }

  // 게임 에셋에서 다음 스테이지(targetStage)의 존재 여부 확인
  const { stages } = getGameAssets();
  if (!stages.data.some((stage) => stage.id === payload.targetStage)) {
    return { status: 'fail', message: 'Target stage does not exist' };
  }

  // 유저의 스테이지 정보 업데이트
  setStage(userId, payload.targetStage, serverTime);
  // 로그를 찍어 확인.
  console.log('Stage:', getStage(userId));

  return { status: 'success', currentStage: getStage(userId).id };
};

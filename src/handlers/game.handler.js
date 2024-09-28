import { getGameAssets } from '../init/assets.js';
import { getStage, setStage } from '../models/stage.model.js';
import { clearStage } from '../models/stage.model.js';

/**
 * 게임 시작 함수
 * @param uuid
 * @param payload
 * @returns
 */
export const gameStart = (uuid, payload) => {
  // 서버 메모리에 있는 게임 에셋에서 stage 정보를 가지고 온다.
  const { stages } = getGameAssets();
  // 이전 스테이지 비우기
  clearStage(uuid);
  // stages 배열에서 0번째 = 첫번째 스테이지 ID를 해당 유저 stage에 저장.
  setStage(uuid, stages.data[0].id, stages.data[0].score, stages.data[0].scorePerSecond, payload.timestamp);
  // 로그를 찍어 확인.
  console.log('Stage:', getStage(uuid));

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

  if (!stages.length) {
    return { status: 'fail', message: 'No stages found for user' };
  }

  // 각 스테이지의 지속 시간을 계산하여 총 점수 계산
  let totalScore = 0;
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
    totalScore += stageDuration;
  });

  // 점수와 타임스탬프 검증 (ex: 클라이언트가 보낸 총점과 계산된 총점 비교)
  // 오차범위 5
  if (Math.abs(score - totalScore) > 5) {
    return { status: 'fail', message: 'Score verification failed' };
  }

  // 모든 검증이 통과된 후, 클라이언트에서 제공한 점수 저장하는 로직
  // saveGameResult(userId, clientScore, gameEndTime);
  // 검증이 통과되면 게임 종료 처리
  return { status: 'success', message: 'Game ended successfully', score };
};
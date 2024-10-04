import redisClient from '../redis/redis.client.js';

const stagesKey = 'stages';

// 스테이지 정보를 객체에 {key: uuid, value: array}의 형태로 uuid를 Key로 저장.
// value:array 에는 stageId를 가진 객체가 들어간다.

/**
 * 초기 스테이지 배열 생성(초기화)
 * @param uuid
 */
export const createStage = async (uuid) => {
  const stagesJSON = await redisClient.get(stagesKey);
  const stages = stagesJSON ? JSON.parse(stagesJSON) : {};

  if (!stages[uuid]) stages[uuid] = [];

  await redisClient.set(stagesKey, JSON.stringify(stages));
};

/**
 * 스테이지 불러오기
 * @param uuid
 */
export const getStage = async (uuid) => {
  const stagesJSON = await redisClient.get(stagesKey);
  const stages = stagesJSON ? JSON.parse(stagesJSON) : {};

  if (!stages[uuid]) stages[uuid] = [];

  return stages[uuid];
};

/**
 * 스테이지 할당
 * @param uuid userId
 * @param id stageId
 * @param score 시작 점수
 * @param scorePerSecond 초당 점수
 * @param timestamp time
 */
export const setStage = async (uuid, id, score, scorePerSecond, timestamp) => {
  const stagesJSON = await redisClient.get(stagesKey);
  const stages = stagesJSON ? JSON.parse(stagesJSON) : {};

  if (!stages[uuid]) stages[uuid] = [];

  stages[uuid].push({ id, score, scorePerSecond, timestamp });
  
  await redisClient.set(stagesKey, JSON.stringify(stages));
};

/**
 * 스테이지 초기화 (새로 시작 시)
 * @param uuid
 */
export const clearStage = async (uuid) => {
  const stagesJSON = await redisClient.get(stagesKey);
  const stages = stagesJSON ? JSON.parse(stagesJSON) : {};

  stages[uuid] = [];

  await redisClient.set(stagesKey, JSON.stringify(stages));
};

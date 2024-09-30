// 스테이지 정보를 객체에 {key: uuid, value: array}의 형태로 uuid를 Key로 저장.
// value:array 에는 stageId를 가진 객체가 들어간다.
const stages = {};

/**
 * 초기 스테이지 배열 생성(초기화)
 * @param uuid 
 */
export const createStage = (uuid) => {
  stages[uuid] = [];
};

/**
 * 스테이지 불러오기
 * @param uuid
 */
export const getStage = (uuid) => {
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
export const setStage = (uuid, id, score, scorePerSecond, timestamp) => {
  stages[uuid].push({ id, score, scorePerSecond, timestamp });
  return;
};

/**
 * 스테이지 초기화 (새로 시작 시)
 * @param uuid
 */
export const clearStage = (uuid) => {
  return stages[uuid] = [];
}
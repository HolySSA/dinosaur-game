import redisClient from '../redis/redis.client.js';

const uuidsKey = 'uuids';

/**
 * uuid 추가
 * @param uuid
 */
export const addUUID = async (uuid) => {
  // redis에서 uuid 리스트 불러오고, 없으면 빈값 생성
  const uuidsJSON = await redisClient.get(uuidsKey);
  const uuids = uuidsJSON ? JSON.parse(uuidsJSON) : [];

  // 해당 uuid 체크
  const exists = uuids.some((entry) => entry.uuid === uuid);

  // 존재 X 시 추가
  if (!exists) {
    uuids.push({ uuid, isHighScore: false });
  }

  await redisClient.set(uuidsKey, JSON.stringify(uuids));
};

/**
 * uuid 업데이트
 * @param uuid
 */
export const updateUUId = async (uuid) => {
  // redis에서 uuid 리스트 불러오고, 없으면 빈값 생성
  const uuidsJSON = await redisClient.get(uuidsKey);
  const uuids = uuidsJSON ? JSON.parse(uuidsJSON) : [];
  // 현재 최고기록 보유 UUID
  const highScoreIndex = uuids.findIndex((entry) => entry.isHighScore);

  // 만약 존재하면 false로 변경
  if (highScoreIndex !== -1) {
    uuids[highScoreIndex].isHighScore = false;
  }

  // 해당 uuid 체크
  const index = uuids.findIndex((entry) => entry.uuid === uuid);

  // isHighScore 업데이트
  if (index !== -1) {
    uuids[index].isHighScore = true;
  } else {
    uuids.push({ uuid, isHighScore: true });
  }

  await redisClient.set(uuidsKey, JSON.stringify(uuids));
};

/**
 * 해당 uuid 조회
 */
export const getUUID = async (uuid) => {
  // redis에서 uuid 리스트 불러오고, 없으면 빈값 생성
  const uuidsJSON = await redisClient.get(uuidsKey);
  const uuids = uuidsJSON ? JSON.parse(uuidsJSON) : [];

  return uuids.find((entry) => entry.uuid === uuid) || null;
};

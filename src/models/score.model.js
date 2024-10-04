import redisClient from '../redis/redis.client.js';

const highScoreKey = 'highScore';

/**
 * 최고 점수 불러오기
 * @returns {number} 현재 최고 점수
 */
export const getHighScore = async () => {
  const highScore = await redisClient.get(highScoreKey);

  return highScore ? parseInt(highScore, 10) : 0;
};

/**
 * 최고 점수 할당하기
 * @param {number} newHighScore 새로운 최고 점수
 */
export const setHighScore = async (newHighScore) => {
  const currentHighScore = await getHighScore();

  if (newHighScore > currentHighScore) {
    await redisClient.set(highScoreKey, newHighScore.toString());
    return true;
  }

  console.log('현재기록: ', newHighScore);
  console.log('최고기록: ', currentHighScore);
  return false;
};

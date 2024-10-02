const HIGH_SCORE_KEY = 'highScore';

let highScore = 0;

/**
 * 최고 점수 불러오기
 * @returns {number} 현재 최고 점수
 */
export const getHighScore = () => {
  return highScore;
};

/**
 * 최고 점수 할당하기
 * @param {number} newHighScore 새로운 최고 점수
 */
export const setHighScore = (newHighScore) => {
  if (newHighScore > highScore) {
    highScore = newHighScore;
    return true;
  }

  return false;
};

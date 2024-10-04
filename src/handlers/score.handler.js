import { getHighScore, setHighScore } from '../models/score.model.js';
import { updateUUId } from '../models/uuid.model.js';

export const updateHighScore = async (uuid, payload) => {
  //console.log('highScore: ', getHighScore());
  //console.log('cur Score: ', Math.floor(payload.score));
  
  const isHighScore = await setHighScore(Math.floor(payload.score));
  if (isHighScore) {
    await updateUUId(uuid);
    const currentHighScore = await getHighScore();
    return { broadcast: true, status: "success", message: '게임 종료... 최고 점수 갱신!', highScore: currentHighScore };
  }

  return null;
};

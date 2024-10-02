import { getHighScore, setHighScore } from '../models/score.model.js';
import { updateUUId } from '../models/uuid.model.js';

export const updateHighScore = (uuid, payload) => {
  //console.log('highScore: ', getHighScore());
  //console.log('cur Score: ', Math.floor(payload.score));
  
  if (setHighScore(Math.floor(payload.score))) {
    updateUUId(uuid);
    return { broadcast: true, status: "success", message: '게임 종료... 최고 점수 갱신!', highScore: getHighScore() };
  }

  return null;
};

let highScore = 0;

export function getHighScore() {
  return highScore;
}

export function setHighScore(score) {
  // console.log('highscore set: ', highScore);
  highScore = Math.floor(score);
}

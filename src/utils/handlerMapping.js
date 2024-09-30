import { gameEnd, gameStart } from '../handlers/game.handler.js';
import { moveStageHandler } from '../handlers/stage.handler.js';
import { getItemhandler } from '../handlers/item.handler.js';

const handlerMappings = {
  2: gameStart,
  3: gameEnd,
  11: moveStageHandler,
  21: getItemhandler,
};

export default handlerMappings;

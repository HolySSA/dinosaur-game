import config from '../config/config.js';
import { readFileAsync } from '../utils/fileUtils.js';

let gameAssets = {};

/**
 * Promise.all()을 이용하여 게임 에셋 불러오기
 * @returns gameAssets - 게임 에셋
 */
export const loadGameAssets = async () => {
  try {
    const { stagesFile, itemsFile, itemUnlocksFile } = config;

    const [stages, items, itemUnlocks] = await Promise.all([
      readFileAsync(stagesFile),
      readFileAsync(itemsFile),
      readFileAsync(itemUnlocksFile),
    ]);

    gameAssets = { stages, items, itemUnlocks };
    return gameAssets;
  } catch (err) {
    throw new Error('Failed to load game assets: ' + err.message);
  }
};

export const getGameAssets = () => {
  return gameAssets;
};

let gameAssets = {};

export const loadGameAssets = (assets) => {
  try {
    gameAssets = {
      stages: assets.stages,
      items: assets.items,
      itemUnlocks: assets.itemUnlocks,
    };

    return gameAssets;
  } catch (err) {
    throw new Error('Failed to load game assets: ' + err.message);
  }
};

export const getGameAssets = () => {
  console.log('Current game assets:', gameAssets);
  return gameAssets;
};

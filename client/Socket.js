import { CLIENT_VERSION } from './Constants.js';
import { loadGameAssets, getGameAssets } from './Assets.js';
import { setCurrentStage } from './Stage.js';
import { score } from './index.js';

// 소켓을 http://localhost:3000 주소로
const socket = io('http://localhost:3000', {
  query: {
    clientVersion: CLIENT_VERSION,
  },
});

let userId = localStorage.getItem('userId') || null;

socket.on('response', (data) => {
  console.log('this is ', data);

  //if (data.currentStage !== undefined) setCurrentStage(data.currentStage);
});

// 처음 연결 시
socket.on('connection', async (data) => {
  console.log('start connection: ', data);

  if (data && data.uuid) {
    userId = data.uuid;
    localStorage.setItem('userId', userId);
    // 게임 에셋 로드
    loadGameAssets(data.gameAssets);
    //console.log('로드한 에셋: ', getGameAssets());
    const gameAssets = getGameAssets();
    setCurrentStage(gameAssets.stages.data[0]);
  }
});

// 이벤트 보내기
const sendEvent = (handlerId, payload) => {
  socket.emit('event', {
    userId,
    clientVersion: CLIENT_VERSION,
    handlerId,
    payload,
  });
};

export { sendEvent };

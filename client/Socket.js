import { CLIENT_VERSION } from './Constants.js';

// 소켓을 http://localhost:3000 주소로
const socket = io('http://localhost:3000', {
  query: {
    clientVersion: CLIENT_VERSION,
  },
});

let userId = null;
socket.on('response', (data) => {
  console.log(data);
});

// 처음 연결 시
socket.on('connection', (data) => {
  console.log('connection: ', data);
  userId = data.uuid;
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

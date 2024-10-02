import { CLIENT_VERSION } from '../config/constants.js';
import { getUsers, removeUser } from '../models/user.model.js';
import handlerMappings from './handlerMapping.js';
import { createStage } from '../models/stage.model.js';
import { getGameAssets } from '../init/assets.js';
import { getHighScore } from '../models/score.model.js';
import { getUUID } from '../models/uuid.model.js';

/**
 * 사용자 삭제
 * @param socket
 * @param uuid
 */
export const handleDisconnect = (socket, uuid) => {
  // 사용자 삭제
  removeUser(socket.id);

  console.log(`User disconnected: ${socket.id}`);
  console.log('Current users:', getUsers());
};

/**
 * 사용자 연결
 * @param socket
 * @param uuid
 */
export const handleConnection = (socket, uuid) => {
  console.log(`New user connected: ${uuid} with socket ID ${socket.id}`);
  console.log('Current users:', getUsers());

  // 스테이지 빈 배열 생성
  createStage(uuid);

  const uuidInfo = getUUID(uuid);
  let message;
  if (uuidInfo.isHighScored) message = '반갑습니다, 현재 최고 기록 보유 중입니다!';
  else message = '반갑습니다, 최고 기록에 도전하세요!';

  // emit 메서드로 해당 유저에게 메시지 전달.
  socket.emit('connection', { message: message, uuid: uuid, gameAssets: getGameAssets(), highScore: getHighScore() });
};

/**
 * 유저의 모든 메세지를 받아 적절한 핸들러로 보내주는 이벤트 핸들러.
 * @param io
 * @param socket
 * @param data
 */
export const handleEvent = (io, socket, data) => {
  // 서버에 저장된 클라이언트 배열에서 메세지로 받은 클라이언트 버전 확인.
  if (!CLIENT_VERSION.includes(data.clientVersion)) {
    // 일치하는 버전이 없다면 response 이벤트로 fail 결과 전송.
    socket.emit('response', { status: 'fail', message: 'Client version mismatch' });
    return;
  }

  // 메세지로 오는 handlerId에 따라 handlerMappings 객체에서 적절한 핸들러를 찾기.
  const handler = handlerMappings[data.handlerId];
  // 적절한 핸들러가 없다면 실패처리.
  if (!handler) {
    socket.emit('response', { status: 'fail', message: 'Handler not found' });
    return;
  }

  // 적절한 핸들러에 userID, payload를 전달하고 결과 받기.
  const response = handler(data.userId, data.payload);
  // 만약 결과에 broadcast(모든 유저에게 전달)가 있다면 broadcast.
  if (response.broadcast) {
    io.emit('response', response);
    console.log(`모든 유저에게 전송: ${response.highScore}`);
    return;
  }

  // 해당 유저(하나)에게 적절한 response를 전달.
  socket.emit('response', response);
};

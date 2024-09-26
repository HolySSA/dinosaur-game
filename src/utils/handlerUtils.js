import { CLIENT_VERSION } from '../config/constants.js';
import { getUsers, removeUser } from '../models/user.model.js';
import handlerMappings from './handlerMapping.js';
import { createStage } from '../models/stage.model.js';

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

  // emit 메서드로 해당 유저에게 메시지를 전달할 수 있다.
  // 현재의 경우 접속하고 나서 생성된 uuid를 바로 전달해주고 있다.
  socket.emit('connection', { uuid: uuid });
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
    io.emit('response', 'broadcast');
    return;
  }

  // 해당 유저(하나)에게 적절한 response를 전달.
  socket.emit('response', response);
};

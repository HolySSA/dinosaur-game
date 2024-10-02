import { v4 as uuidv4 } from 'uuid';
import { addUser } from '../models/user.model.js';
import { handleDisconnect, handleConnection, handleEvent } from '../utils/handlerUtils.js';
import { createStage } from '../models/stage.model.js';
import { addUUID } from '../models/uuid.model.js';

/**
 * 레지스터 핸들러
 * @param io
 */
const registerHandler = (io) => {
  // 최초 커넥션을 맺은 이후 발생하는 각종 이벤트를 처리
  io.on('connection', (socket) => {
    // UUID 생성 -> 사용자 추가 -> 스테이지 생성
    const userUUID = uuidv4();
    // user, uuid, stage 생성
    addUser({ uuid: userUUID, socketId: socket.id });
    addUUID(userUUID);
    createStage(userUUID);

    // 접속시 유저 정보 생성 이벤트 처리
    handleConnection(socket, userUUID);

    // 메세지를 data라는 이름으로 handlerEvent 함수로 전달.
    socket.on('event', (data) => handleEvent(io, socket, data));
    // 접속 해제시 이벤트 처리 (하나의 소켓)
    socket.on('disconnect', (soket) => handleDisconnect(socket, userUUID));
  });
};

export default registerHandler;

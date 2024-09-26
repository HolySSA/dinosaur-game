import { Server as SocketIO } from 'socket.io';
import registerHandler from '../handlers/register.handler.js';

/**
 * 서버 시작 시 초기화(init)
 * @param server 
 */
const initSocket = (server) => {
  const io = new SocketIO();
  io.attach(server);

  // 클라이언트로부터 오는 이벤트를 처리할 핸들러 등록
  registerHandler(io);
};

export default initSocket;
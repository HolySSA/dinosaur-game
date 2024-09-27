const users = [];

/**
 * 서버 메모리에 유저의 세션(소켓ID)을 저장.
 * 유저는 객체 형태로 : { uuid: string; socketId: string; };
 * @param user
 */
export const addUser = (user) => {
  users.push(user);
};

/**
 * 배열에서 유저 삭제
 * @param socketId
 */
export const removeUser = (socketId) => {
  const index = users.findIndex((user) => user.socketId === socketId);
  if (index !== -1) {
    return users.splice(index, 1)[0];
  }
};

/**
 * 전체 유저 조회
 */
export const getUsers = () => {
  return users;
};

/**
 * 유저 번호 조회
 * @param {string} uuid - 유저 고유 ID
 * @returns {number} idx - 유저의 인덱스, 없으면 -1
 */
export const getUserIndex = (uuid) => {
  const idx = users.findIndex((user) => user.uuid === uuid);
  return idx;
};

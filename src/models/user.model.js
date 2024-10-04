import redisClient from "../redis/redis.client.js";

const usersKey = "users";

/**
 * @param user
 */
export const addUser = async (user) => {
  const usersJSON = await redisClient.get(usersKey);
  const users = usersJSON ? JSON.parse(usersJSON) : [];

  users.push(user);

	await redisClient.set(usersKey, JSON.stringify(users));
};

/**
 * 배열에서 유저 삭제
 * @param socketId
 */
export const removeUser = async (socketId) => {
  const usersJSON = await redisClient.get(usersKey);
  const users = usersJSON ? JSON.parse(usersJSON) : [];

  const index = users.findIndex((user) => user.socketId === socketId);
  if (index !== -1) {
    users.splice(index, 1);
  }

	await redisClient.set(usersKey, JSON.stringify(users));
};

/**
 * 전체 유저 조회
 */
export const getUsers = async () => {
  const usersJSON = await redisClient.get(usersKey);
  const users = usersJSON ? JSON.parse(usersJSON) : [];

  return users;
};

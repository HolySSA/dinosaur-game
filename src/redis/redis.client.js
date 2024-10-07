import { createClient } from 'redis';

const redisClient = createClient({
  // localhost:6379
  url: 'redis://52.79.242.227:6379',
});

redisClient.on('connect', () => {
  console.info('Redis connected!');
});

redisClient.on('error', (err) => {
  console.error('Redis Client Error', err);
});

(async () => {
  try {
    await redisClient.connect();
    console.log('Redis에 성공적으로 연결되었습니다.');
  } catch (err) {
    console.error('Redis에 연결할 수 없습니다.', err);
  }
})();

export default redisClient;
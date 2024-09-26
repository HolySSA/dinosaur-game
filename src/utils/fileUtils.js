import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// 파일의 절대경로
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// 최상위 경로 + assets 폴더
const basePath = path.join(__dirname, '../../assets');

/** 파일 읽기 함수 - 비동기 병렬 처리
 * @param {string} filename - 파일 이름
 * @return Json 파일 형태로
 */
const readFileAsync = (filename) => {
  return new Promise((resolve, reject) => {
    fs.readFile(path.join(basePath, filename), 'utf8', (err, data) => {
      if (err) {
        reject(err);
        return;
      }

      resolve(JSON.parse(data));
    });
  });
};

export { readFileAsync };

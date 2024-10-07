# 🦖 Dinosaur Game

플랫포머 게임 **"Dinosaur Game"**을 구현해보자! 이 프로젝트는 Chrome Dino 게임의 모작입니다. 간단한 게임을 통해 기본적인 게임 메커니즘과 클라이언트-서버 간의 상호작용을 이해할 수 있습니다.

## Stage 구분

서버<br><br>

[stage.handler.js](src/handlers/stage.handler.js)<br>
[stage.model.js](src/models/stage.model.js)<br>

클라이언트<br><br>

[Stage.js](client/Stage.js)<br>
[Score.js](client/Score.js)<br>
[index.js](client/index.js)<br>

## 스테이지에 따른 점수 획득 구분

[stage.json](assets/stage.json)<br>

## 스테이지에 따라 아이템이 생성

[item_unlock.json](assets/item_unlock.json)<br>

## 아이템 획득 시 점수 획득

서버<br><br>
[item.handler.js](src/handlers/item.handler.js)<br>
[item.model.js](src/models/item.model.js)<br>

클라이언트<br><br>
[Score.js](client/Score.js)<br>
[index.js](client/index.js)<br>

## 아이템 별 획득 점수 구분

[item.json](assets/item.json)<br>

## Broadcast 기능 추가

[handlerUtils.js](src/utils/handlerUtils.js)<br>

## 가장 높은 점수 Record 관리

[score.model.js](src/models/score.model.js)<br>
[score.handler.js](src/handlers/score.handler.js)<br>

## 유저 정보 연결

[uuid.model.js](src/models/uuid.model.js)<br>
[game.handler.js](src/handlers/game.handler.js)<br>
[handlerUtils.js](src/utils/handlerUtils.js)<br>

## Redis 연동, 게임 정보 저장

[redis.client.js](src/redis/redis.client.js)<br>
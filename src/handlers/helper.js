// 컨텐츠 외에 필수 이벤트 처리 핸들러들이 선언될 파일입니다.
import { getUsers, removeUser } from "../models/user.model.js";
import { CLIENT_VERSION } from '../constants.js';
import handlerMappings from "./handlerMapping.js";
import { getGameAssets } from "../init/assets.js";
import {createStage} from "../models/stage.model.js";

// 커넥션에 관련된 이벤트들을 처리.
export const handleConnection = (socket, userUUID) => {
  console.log(`New user connected: ${userUUID} with socket ID${socket.id}`);
  console.log("Current users:", getUsers());

  createStage(userUUID);

  //emit 메서드로 해당 유저에게 메시지를 전달할 수 있다.
  // 현재의 경우 접속하고 나서 생성된 uuid를 바로 전달해 주고 있다.
  socket.emit("connection", { uuid: userUUID });
};

export const handleDisconnect = (socket, uuid) => {
  removeUser(socket.id); // 사용자 삭제
  console.log(`User disconnected: ${socket.id}`);
  console.log("Current users:", getUsers());

};

// 핸들러 이벤트함수에서는 3가지 기능 수행
// 1. 클라이언트 버전 체크
// 2. 핸들러 맵핑
// 3. 유저에게 메시지 전송
export const handleEvent = (io, socket, data) => {
  // 서버에 저장된 클라이언트 배열에서 메세지로 받은 clientVersion을 확인합니다.
  if(!CLIENT_VERSION.includes(data.clientVersion)){
    // 만약 일치하는 버전이 없다면 response 이벤트로 fail 결과를 전송합니다.
    socket.emit("response", {status: "fail", message: "Client version mismatch"});
    return;
  }

  // 메세지로 오는 handler에 따라 handlerMappings 객체에서 적절한 핸들러를 찾습니다.
  const handler = handlerMappings[data.handlerId];
  // 적절한 핸들러가 없다면 실패처리합니다.
  if(!handler){
    socket.emit("response", {status: "fail", message: "handler not found"});
    return;
  }

  // 적절한 핸들러에 userID와 payload를 전달하고 결과를 받습니다.
  const response = handler(data.userId, data.payload);
  // 만약 결과에 broadcast (모든 유저에게 전달)이 있다면 broadcast 합니다.
  if(response.broadcast){
    io.emit("response", "broadcast");
    return;
  }

  // 해당하는 하나의 유저에게 적절한 response를 전달합니다.
  socket.emit("response", response);

};

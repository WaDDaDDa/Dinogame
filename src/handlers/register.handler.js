import { v4 as uudiv4 } from "uuid";
import { addUser } from "../models/user.model.js";
import { handleDisconnect } from "./helper.js";

const registerHandler = (io) => {
    // 새로운 소켓 연결이 발생할 때마다 그 소켓에 대한 이벤트를 처리할 수 있도록 준비.
  io.on("connection", (socket) => {
    // 최초 커넥션을 맺은 이후 발생하는 각종 이벤트를 처리하는 곳

    const userUUID = uudiv4(); // UUID 생성
    addUser({ uuid: userUUID, socketId: socket.id }); // 사용자 추가

    // 접속 해제시 이벤트 처리
    // 각각의 연결된 클라이언트 소켓에서 발생하는 이벤트를 처리합니다.
    // 클라이언트와 서버간에 연결이 성립된 후, 개별 소켓 객체에서 발생하는 이벤트를 감지하여 처리합니다.
    socket.on("disconnect", () => {handleDisconnect(socket, userUUID)});
  });
};

export default registerHandler;

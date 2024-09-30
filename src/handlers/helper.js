// 컨텐츠 외에 필수 이벤트 처리 핸들러들이 선언될 파일입니다.

import { getUsers, removeUser } from '../models/user.model.js';

export const handleDisconnect = (socket, uuid) => {
  removeUser(socket.id); // 사용자 삭제
  console.log(`User disconnected: ${socket.id}`);
  console.log('Current users:', getUsers());
};
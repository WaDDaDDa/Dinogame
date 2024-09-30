const users = [];

// 서버 메모리에 유저의 세션(소켓ID)을 저장
// 이때 유저는 객체 형태로 저장
// 유저 추가
// { uuid: string; socketId: string; };
export const addUser = (user) => {
  users.push(user);
};

// 유저가 접속을해서 유저를 추가 하였다면, 접속을 해제한 경우에는 유저를 삭제시켜줘야 한다.
export const removeUser = (socketId) => {
    const index = users.findIndex((user) => user.socketId === socketId);
    if(index !== -1){
        return users.splice(index, 1)[0];
    }
}

// 전체 유저 조회
export const getUsers = () => {
  return users;
};

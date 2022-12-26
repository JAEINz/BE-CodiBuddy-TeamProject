const express = require("express");
const userRouter = express.Router();
//const { Router } = require("express");
// 폴더에서 import하면, 자동으로 폴더의 index.js에서 가져옴
const { loginRequired } = require("../middlewares");
const { userService } = require("../service");


// 회원가입 api
userRouter.post("/", async (req, res, next) => {
  try {
    const user_id = req.body.user_id;
    const pw = req.body.pw;
    const nickname = req.body.nickname;
    const email = req.body.email;
    const introduce = req.body.introduce;

    //위 데이터를 유저 db에 추가하기
    const newUser = await userService.addUser({
      user_id,
      pw,
      nickname,
      email,
      introduce,
    });

    res.status(201).json(newUser);
  } catch (error) {
    next(error);
  }
});




// 로그인
userRouter.post("/login", async (req, res, next) => {
  try {
    // application/json 설정을 프론트에서 안 하면, body가 비어 있게 됨.

    // req (request) 에서 데이터 가져오기
    const user_id = req.body.user_id;
    const pw = req.body.pw;

    // 로그인 진행 (로그인 성공 시 jwt 토큰을 프론트에 보내 줌)
    const userToken = await userService.getUserToken({ user_id, pw });

    // jwt 토큰을 프론트에 보냄 (jwt 토큰은, 문자열임)
    res.status(200).json(userToken);
  } catch (error) {
    next(error);
  }
});





//회원 본인 정보 조회
userRouter.get("/", /*loginRequired,*/ async function (req, res, next) {
  try {
    //const Id = req.currentUserId;
    const userId = 1;
    const currentUserInfo = await userService.getUserData(userId);
    res.status(200).json(currentUserInfo);
  } catch (error) {
    next(error);
  }
});






//수정해야됨!!!!!!
// 회원 정보 수정
// (예를 들어 /api/users/abc12345 로 요청하면 req.params.userId는 'abc12345' 문자열로 됨)
userRouter.patch("/:id", /*loginRequired,*/ async (req, res, next) => {
  try {
    const id = req.params.id;
    // body data 로부터 업데이트할 사용자 정보를 추출함.
    const user_id = req.body.user_id;
    const pw = req.body.pw;
    const nickname = req.body.nickname;
    const email = req.body.email;
    const introduce = req.body.introduce;
    const profile_image = req.body.profile_image;

    const toUpdate = {
      ...(user_id && { user_id }),
      ...(pw && { pw }),
      ...(nickname && { nickname }),
      ...(email && { email }),
      ...(introduce && { introduce }),
      ...(profile_image && { profile_image }),
    };

    //사용자 정보를 업데이트함.
    const updatedUserInfo = await userService.setUser(
      /*userInfoRequired,*/
      toUpdate
    );

    // 업데이트 이후의 유저 데이터를 프론트에 보내 줌
    res.status(200).json(updatedUserInfo);
  } catch (error) {
    next(error);
  }
});




//회원탈퇴 (loginRequired 수정필요)
userRouter.delete(
  "/:id",
  /*loginRequired,*/
  async function (req, res, next) {
    try {
      // params로부터 id를 가져옴
      const id = req.params.id;

      const deleteResult = await userService.deleteUserData(id);

      res.status(200).json(deleteResult);
    } catch (error) {
      next(error);
    }
  }
);


module.exports = userRouter;
//export { userRouter };

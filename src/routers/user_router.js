const express = require("express");
const userRouter = express.Router();
const upload = require("../middlewares/upload");
//const { Router } = require("express");
// 폴더에서 import하면, 자동으로 폴더의 index.js에서 가져옴
const { loginRequired } = require("../middlewares/login_required");
const {
  userService,
  userTagService,
  userRefreshTokenService,
} = require("../service");

// 회원가입 api
userRouter.post("/", async (req, res, next) => {
  try {
    const user_id = req.body.user_id;
    const pw = req.body.pw;
    const nickname = req.body.nickname;
    const email = req.body.email;
    const introduce = req.body.introduce;
    const tag = req.body.tag;
    
    
    //위 데이터를 유저 db에 추가하기
    const newUser = await userService.addUser({
      user_id,
      pw,
      nickname,
      email,
      introduce,
    });

    const userid = newUser.id
    await userTagService.addUserTag(tag, userid);
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

    //rt 토큰 저장
    const refresh_token = await userRefreshTokenService.addToken(userToken.userId);
    // jwt 토큰을 프론트에 보냄 (jwt 토큰은, 문자열임)
    res.status(200).json({userToken:userToken.token,refresh_token});
  } catch (error) {
    next(error);
  }
});

userRouter.post("/confirm_jwt", async (req, res, next) => {
  try {
    const userId = req.body.user_id;
    const currentToken = req.body.refresh_token;
    // 로그인 진행 (로그인 성공 시 jwt 토큰을 프론트에 보내 줌)
    const newJwt = await userRefreshTokenService.resetJwt(userId, currentToken);
    if (newJwt) {
      res.status(200).json({newJwt});
    } else {
      res.status(403).json({
        result: "forbidden-approach",
        reason: "정상적인 토큰이 아닙니다.",
      });
    }
  } catch (error) {
    next(error);
  }
});

userRouter.delete("/confirm_jwt",loginRequired, async (req, res, next) => {
  try {
    const userId = req.userId;
    const currentToken = req.body.refresh_token;
    // 로그인 진행 (로그인 성공 시 jwt 토큰을 프론트에 보내 줌)
    const deleteToken = await userRefreshTokenService.deleteMyToken(userId,currentToken);
    res.status(200).json(deleteToken);
  } catch (error) {
    next(error);
  }
});

//회원 본인 정보 조회
userRouter.get("/", loginRequired, async function (req, res, next) {
  try {
    const userId = req.userId;
    const currentUserInfo = await userService.getUserData(userId);
    res.status(200).json(currentUserInfo);
  } catch (error) {
    next(error);
  }
});

// 회원 정보 수정
userRouter.patch(
  "/",
  loginRequired,
  upload.single("profile_image"),
  async (req, res, next) => {
    try {
      const { nickname, email, introduce, pw, point, tag } = req.body;
      const { checkPassword } = req.body;
      const tagList = tag.split(',')
      if (!checkPassword) {
        throw new Error("정보를 변경하려면, 현재의 비밀번호가 필요합니다.");
      }
      const id = req.userId;
      let profile_image = null;
      if(req.file){
        profile_image = req.file.location;
      }
      const userInfoRequired = { id, checkPassword };
      const updateData = {
        ...(nickname && { nickname }),
        ...(email && { email }),
        ...(introduce && { introduce }),
        ...(profile_image && { profile_image }),
        ...(pw && { pw }),
        ...(point && { point }),
      };

      //사용자 정보를 업데이트함.
      const updatedUserInfo = await userService.setUser(
        userInfoRequired,
        updateData
      );

        await userTagService.deleteUserTag(id)
        await userTagService.addUserTag(tagList,id)

      // 업데이트 이후의 유저 데이터를 프론트에 보내 줌
      res.status(200).json(updatedUserInfo);
    } catch (error) {
      next(error);
    }
  }
);


// 결제시 포인트 차감
userRouter.patch(
  "/payment",
  loginRequired,
  async (req, res, next) => {
    try {
      const { point } = req.body;
      const id = req.userId;
      const userInfoRequired = { id };
      const updateData = {
        ...(point && { point }),
      };

      //사용자 정보를 업데이트함.
      const updatedUserInfo = await userService.setUserPoint(
        userInfoRequired,
        updateData
      );

      // 업데이트 이후의 유저 데이터를 프론트에 보내 줌
      res.status(200).json(updatedUserInfo);
    } catch (error) {
      next(error);
    }
  }
);


//회원탈퇴
userRouter.delete("/", loginRequired, async function (req, res, next) {
  try {
    const id = req.userId;
    //const id = 2;
    const deleteResult = await userService.deleteUserData(id);
    res.status(200).json(deleteResult);
  } catch (error) {
    next(error);
  }
});

module.exports = userRouter;

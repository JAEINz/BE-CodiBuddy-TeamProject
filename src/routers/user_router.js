import { Router } from 'express';
import is from '@sindresorhus/is';
// 폴더에서 import하면, 자동으로 폴더의 index.js에서 가져옴
import passport from 'passport';
import { loginRequired } from '../middleware';
import jwt from 'jsonwebtoken';
import { userService } from '../services';
const userRouter = Router();

// 회원 가입
userRouter.post('/users/register', async (req, res, next) => {
    try {
      const { user_id, pw, nickname, email, introduce, profile_image } = req.body;
      const info = { user_id, pw, nickname, email, introduce, profile_image };
      const user = await userService.addUser(info);
      res.status(201).json(user);
    } catch (err) {
      next(err);
    }
  });
  


  // 로그인 api
userRouter.post('/uers/login', async (req, res, next) => {
  try {
      // application/json 설정을 프론트에서 안 하면, body가 비어 있게 됨.
      if (is.emptyObject(req.body)) {
          throw new Error(
              'headers의 Content-Type을 application/json으로 설정해주세요',
          );
      }
      passport.authenticate(
          'local',
          { session: false },
          (error, user, info) => {
              // 성공적으로 유저가 있어야 유저 객체가 생기고,
              //유저 인증 실패시 유저는 자동으로 false;

              if (error || !user) {
                  //인증 성공을 해야 유저 객체가 생겨서 JOI로 검증하기 어려움...
                  // passport 인증 실패 or 유저가 없으면 error
                  res.status(400).json({
                      result: 'error',
                      reason: info.message,
                  });
                  return; // throw로 여러개를 시도해 보았는데, throw로는 에러 해결이 잘 안됨.
              }
              req.login(user, { session: false }, (loginError) => {
                  // login을 하면
                  if (loginError) {
                      res.status(400).send(loginError);
                      return;
                  }
                  const secretKey =
                      process.env.JWT_SECRET_KEY || 'secret-key'; // login 성공시 key값을 써서 토큰 생성
                  const token = jwt.sign(
                      { userId: user._id },
                      secretKey,
                      {
                          expiresIn: '7d',
                      },
                  );
                  res.status(200).json({
                      token,
                      userId: user._id,
                  });
              });
          },
      )(req, res);
  } catch (error) {
      next(error);
  }
});


export { userRouter };

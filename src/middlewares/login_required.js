const jwt = require("jsonwebtoken");

function loginRequired(req, res, next) {
  const token = req.headers.authorization;
  if (!token || token === 'null') {
    console.log('Authorization 토큰: 없음');
    res.status(403).json({
      result: 'forbidden-approach',
      reason: '로그인한 유저만 사용할 수 있는 서비스입니다.',
    });

    return;
  }

  // 해당 token 이 정상적인 token인지 확인
  try {
    const secretKey = process.env.JWT_SECRET_KEY
    const jwtDecoded = jwt.verify(token, secretKey);

    const { userId, status } = jwtDecoded;

    if (status === "temp") {
      return res.redirect('/googleSignup')
    }

    req.userId = userId;
    req.userStatus = status;

    next();
  } catch (error) {
    res.status(403).json({
      result: 'forbidden-approach',
      reason: '정상적인 토큰이 아닙니다.',
    });
  }
}


module.exports = { loginRequired };

const dayjs = require("dayjs");
const { UserRefreshToken } = require("../db/models");
const { Op } = require("sequelize");
const jwt = require("jsonwebtoken");


class UserRefreshTokenService {
  constructor(Token_model) {
    this.Token = Token_model;
  }

  //토큰 추가
  async addToken(userId) {
    try {
      const len = 50;
      const possible =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+~{}[]:;<>?./";
      let token = "";
      for (var i = 0; i < len; i++)
        token += possible.charAt(Math.floor(Math.random() * possible.length));

      const now = dayjs();
      const createToken = await this.Token.create({
        user_id: userId,
        refresh_token: token,
        expired_at: now.add(12, "M").format("YYYY-MM-DD"),
      });
      return createToken.refresh_token;
    } catch (err) {
      console.log(err);
    }
  }

  //로그아웃시 삭제
  async deleteMyToken(userId, token) {
    const deleteToken = await this.Token.destroy({
      where: {
        user_id: userId,
        refresh_token: token,
      },
    });
    return deleteToken;
  }

  //jwt 만료시 rt확인 및 jwt 생성
  async resetJwt(userId, refresh_token) {
    const now = dayjs();
    const confirmRefreshToken = await this.Token.findOne({
      where: {
        user_id: userId,
        refresh_token: refresh_token,
        expired_at: {
          [Op.gte]: now.format("YYYY-MM-DD"),
        },
      },
    });
    if (confirmRefreshToken) {
      const secretKey = process.env.JWT_SECRET_KEY

      const token = jwt.sign(
        {
          userId: userId,
          exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24,
        },
        secretKey
      );

      return token;
    }
  }

}

module.exports = new UserRefreshTokenService(UserRefreshToken);

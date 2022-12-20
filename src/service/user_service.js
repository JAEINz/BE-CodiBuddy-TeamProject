import { Op, Sequelize } from 'sequelize';
import bcrypt from 'bcrypt';
import { User } from '../db/models';


class UserService {
    // 본 파일의 맨 아래에서, new UserService(User) 하면, 이 함수의 인자로 전달됨
    constructor(User) {
        this.User = User;
    }

    // 회원가입
    async addUser(userInfo) {
        // 객체 destructuring
        const { user_id, pw, nickname, email, introduce, profile_image } = userInfo;

        // 이메일 중복 확인
        const user = await this.User.findByEmail(email);
        if (user) {
            throw new Error(
                '이 이메일은 현재 사용중입니다. 다른 이메일을 입력해 주세요.',
            );
        }

        // 이메일 중복은 이제 아니므로, 회원가입을 진행함

        // 우선 비밀번호 해쉬화(암호화)
        const hashedPassword = await bcrypt.hash(pw, 10);

        const newUserInfo = { user_id, pw: hashedPassword, nickname, email, introduce, profile_image };

        // db에 저장
        const createdNewUser = await this.User.create(newUserInfo);

        return createdNewUser;
    }
    async getUser(user_Id) {
        const user = await this.User.findById(user_Id);
        return user;
    }
    // 사용자 목록을 받음.
    async getUsers() {
        const users = await this.User.findAll();
        return users;
    }






    // 로그인
  async getUserToken(loginInfo) {
    // 객체 destructuring
    const { email, pw } = loginInfo;

    // 우선 해당 이메일의 사용자 정보가  db에 존재하는지 확인
    const user = await this.User.findByEmail(email);
    if (!user) {
      throw new Error(
        "해당 이메일은 가입 내역이 없습니다. 다시 한 번 확인해 주세요."
      );
    }

    // 이제 이메일은 문제 없는 경우이므로, 비밀번호를 확인함

    // 비밀번호 일치 여부 확인
    const correctPasswordHash = user.pw; // db에 저장되어 있는 암호화된 비밀번호

    // 매개변수의 순서 중요 (1번째는 프론트가 보내온 비밀번호, 2번쨰는 db에 있떤 암호화된 비밀번호)
    const isPasswordCorrect = await bcrypt.compare(
      pw,
      correctPasswordHash
    );

    if (!isPasswordCorrect) {
      throw new Error(
        "비밀번호가 일치하지 않습니다. 다시 한 번 확인해 주세요."
      );
    }

    // 로그인 성공 -> JWT 웹 토큰 생성
    const secretKey = process.env.JWT_SECRET_KEY || "secret-key";

    // 2개 프로퍼티를 jwt 토큰에 담음
    const token = jwt.sign({ user_Id: user._id }, secretKey);


    return { token };
  }

  // 특정 사용자 정보 조회
  async getUserData(user_Id) {
    const user = await this.User.findById(user_Id);

    // db에서 찾지 못한 경우, 에러 메시지 반환
    if (!user) {
      throw new Error("가입 내역이 없습니다. 다시 한 번 확인해 주세요.");
    }

    return user;
  }

  // 사용자 목록을 받음.
  async getUsers() {
    const users = await this.User.findAll();
    return users;
  }

  // 유저정보 수정, 현재 비밀번호가 있어야 수정 가능함.
  async setUser(userInfoRequired, toUpdate) {
    // 객체 destructuring
    try {
      const { user_Id, currentPassword } = userInfoRequired;

      const user = await this.User.update({
        user_Id,
        update: toUpdate,
      });

      return user;
    } catch (err) {
      console.log("err", err);
    }
  }
}

const userService = new UserService(User);

export { userService };

const { User,Tag } = require("../db");
const { UserTag } = require("../db/models");
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken");


class UserService {
  // 본 파일의 맨 아래에서, new UserService(userModel) 하면, 이 함수의 인자로 전달됨
  constructor(user_model, user_tag_model) {
    this.User = user_model;
    this.UserTag = user_tag_model;
  }

  // 회원가입
  async addUser(userInfo) {
    const { user_id, pw, nickname, email, introduce } = userInfo;
    const emailResult = await this.User.findOne({
      where: { email },
    });
    //중복확인
    if (emailResult) {
      throw new Error('중복된 이메일입니다.');
    }

    const nicknameResult = await this.User.findOne({
      where: { nickname },
    });
    if (nicknameResult) {
      throw new Error('중복된 닉네임입니다.');
    }

    const useridResult = await this.User.findOne({
      where: { user_id },
    });
    if (useridResult) {
      throw new Error('중복된 아이디입니다.');
    }



    // 우선 비밀번호 해쉬화(암호화)
    const hashedPassword = await bcrypt.hash(pw, 10);

    const newUserInfo = { user_id, pw: hashedPassword, nickname, email, introduce };

    // db에 저장
    const createdNewUser = await this.User.create(newUserInfo);

    return createdNewUser;
  }







  // // 로그인
  async getUserToken(loginInfo) {
  //   // 객체 destructuring
    const { user_id, pw } = loginInfo;

  //   //아이디가  db에 존재하는지 확인
  //   //const findByUserId = await User.findOne({ _id: userId });
    const users = await this.User.findOne({
      where: { user_id },
    }); 
    if (!users) {
      throw new Error(
        "가입되지 않은 아이디 입니다."
      );
    }

  //비밀번호 일치 여부 확인
    const correctPasswordHash = users.pw; // db에 저장되어 있는 암호화된 비밀번호
  //매개변수의 순서 중요 (1번째는 프론트가 보내온 비밀번호, 2번쨰는 db에 있던 암호화된 비밀번호)
    const isPasswordCorrect = await bcrypt.compare(
      pw,
      correctPasswordHash
    );

    if (!isPasswordCorrect) {
      throw new Error(
        "비밀번호가 일치하지 않습니다. 다시 한 번 확인해 주세요."
      );
    }

  //   // 로그인 성공 -> JWT 웹 토큰 생성
    const secretKey = process.env.JWT_SECRET_KEY

  //   // 2개 프로퍼티를 jwt 토큰에 담음
    const token = jwt.sign({ userId: users.dataValues.id, exp: Math.floor(Date.now()/1000)+(60 * 60 * 24) }, secretKey);
    
    
  //   //const isAdmin = user.role === "admin";

    return { token:token, userId: users.id };
  }






  //마이페이지 조회
  async getUserData(id) {
    const getOneStudy = await this.User.findAll({
      where: { id },
      include: [
        {
          atrributes: ["tag_id"],
          model: this.UserTag,
          include: {
            model: Tag,
          },
        },
      ],
    });

    // db에서 찾지 못한 경우, 에러 메시지 반환
    if (!getOneStudy) {
      throw new Error("가입 내역이 없습니다. 다시 한 번 확인해 주세요.");
    }

    return getOneStudy;
  }




  // //사용자 목록을 받음.
  // async getUsers() {
  //   const users = await this.User.findAll();
  //   return users;
  //}



 
 // 유저정보 수정, 현재 비밀번호가 있어야 수정 가능함.
 async setUser(userInfoRequired, updateData) {
  // 객체 destructuring
  try {
    const { id, checkPassword } = userInfoRequired;
    const user = await this.User.findOne({
      where: { id: id },
    });
    if (!user) {
      throw new Error("가입내역이 없습니다.");
    }
    const hashedPassword = user.pw;
    const isPasswordSame = await bcrypt.compare(
      checkPassword,
      hashedPassword
    );

    if (!isPasswordSame) {
      throw new Error("현재 비밀번호가 일치하지 않습니다.");
    }

    const { pw } = updateData;
    if (pw) {
      const newHashedPassword = await bcrypt.hash(pw, 10);
      updateData.pw = newHashedPassword;
    }

    const updateUserTag = await this.UserTag.update(updateData.Tag, {
      where: {
        user_id: user.id,
      },})

    const userchange = await this.User.update(updateData, {
      where: { id: id },

      
    });

    return [userchange == 1 || updateUserTag == 1];
//return userchange

  }
  catch (err) {
    if(err=isPasswordSame){
    console.log("현재 비밀번호가 일치하지 않습니다.", err);}
  }
}



// 유저정보 수정, 현재 비밀번호가 있어야 수정 가능함.
async setUserPoint(userInfoRequired, updateData) {
  // 객체 destructuring
  try {
    const { id } = userInfoRequired;
    const user = await this.User.findOne({
      where: { id: id },
    });
    if (!user) {
      throw new Error("가입내역이 없습니다.");
    }

    const userchange = await this.User.update(updateData, {
      where: { id: id },
      
    });

    return userchange
//return userchange

  }
  catch (err) {
    console.log("err", err);
  }
}


  //특정 유저 삭제
  async deleteUserData(id) {
    const deletedCount = await this.User.destroy({
      where: { id: id },
    }); 

    // 삭제에 실패한 경우, 에러 메시지 반환
    if (!deletedCount) {
      throw new Error(`${id} 사용자 데이터 삭제에 실패하였습니다.`);
    }
    return { result: "success" };
  }
}




module.exports = new UserService(User, UserTag);
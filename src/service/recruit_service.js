const { Recruit, Study } = require("../db/models");
const { Op } = require("sequelize");

class RecruitService {
  constructor( recruit_model, study_model ) {
    this.Recruit = recruit_model;
    this.Study = study_model;
  }

  async addRecruit(userId, studyId) {
    //study 모집 인원수 체크 및 + 1
    const limitHeadCount = await this.Study.findOne({
      attributes:['limit_head_count'],
      where:{
        id:studyId
      }
    })
    const updateHeadCount = await this.Study.increment({head_count:1},
      {
        where:{
          id:studyId,
          head_count:{
            [Op.lt]: limitHeadCount.dataValues.limit_head_count
          }
        }
      })

      //study 모집 인원수 +1
    if(updateHeadCount[0][1]){
      const createRecruit = await this.Recruit.create({
        user_id: userId,
        study_id: studyId,
      });
      return createRecruit;
    }else{
      return updateHeadCount
    }
  }
  // 형성된 전체 모임 보기
  async getAllRecruit() {
    const findAllRecruit = await this.Recruit.findAll({});

    return findAllRecruit;
  }

  //내 모임 보기
  // async getMyRecruit() {
  //   const findMyRecruit = await this.Recruit.findAll({});

  //   return findMyRecruit;
  // }

  //환급 대상자 보기(유저 아이디, 환급금)
  async getPayBackUsers(studyId) {
    const findPayBackUsers = await this.Recruit.findAll({
      attributes:['user_id'],
      where:{
        study_id:studyId,
        payment_status:'승인'
      },
      include:{
        model: this.Study,
        attributes:['price']
      }
    });

    return findPayBackUsers;
  }
  //내 모임 삭제하기
  async deleteMyRecruit(userId, studyId) {
    const deleteRecruit = this.Recruit.destroy({
      where: {
        user_id: Number(userId),
        study_id: Number(studyId),
      },
    });
    return deleteRecruit;
  }

  //환급 상태 지정 변경
  async setPayBackUsers(data,qeryString,studyId) {
    const condition = {
      study_id: studyId
    }
    if(qeryString.user){
      const userIds = qeryString.user.split(',')
      for(let i=0;i<userIds.length;i++){
        await this.Recruit.update(data,{
          where:{
            ...condition,
            user_id:Number(userIds[i])
          }
        });
      }
    }else{
      await this.Recruit.update(data,{
        where:condition
      });
    }
  }
}

module.exports = new RecruitService(Recruit, Study);

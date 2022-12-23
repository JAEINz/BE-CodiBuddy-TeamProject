const { Recruit } = require("../db/models");

class RecruitService {
  constructor( recruit_model ) {
    this.Recruit = recruit_model;
  }

  async addRecruit(userId, studyId) {
    const createRecruit = await this.Recruit.create({
      user_id: userId,
      study_id: studyId,
    });

    return createRecruit;
  }
  // 형성된 전체 모임 보기
  async getAllRecruit() {
    const findAllRecruit = await this.Recruit.findAll({});

    return findAllRecruit;
  }

  //내 모임 보기
  async getMyRecruit() {
    const findMyRecruit = await this.Recruit.findAll({});

    return findMyRecruit;
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
  //환급 상태 변경
  async patchMyRecruit() {
    const updateRecruit = await this.Recruit.findOne({});

    return updateRecruit;
  }
}

module.exports = new RecruitService(Recruit);

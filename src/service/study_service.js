const { Study, Recruit, Like } = require("../db/models");

class StudyService {
  constructor(study_model) {
    this.Study = study_model;
    this.Recruit = recruit_model;
    this.Like = like_model;
  }

  async addStudy(studyData) {
    const createStudy = await this.Study.create(studyData);
    
    return createStudy;
  }
  
  async getAllStudy() {
    const findAllStudy = await this.Study.findAll({});
    
    return findAllStudy;
  }
  
  //join으로 recruit에 있는 유저아이디를 통해 study 불러오기
  async getMyStudy(userId) {
    const findMyStudy = await this.Recruit.findAll({
        include: [{association: 'user_id'}],
        where: {
            id: userId
        }
    });
    
    return findMyStudy;
  }

}




const studyService = new StudyService(Study,Recruit,Like)

module.exports = { studyService };

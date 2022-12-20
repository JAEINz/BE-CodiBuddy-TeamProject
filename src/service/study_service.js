const { User } = require("../db");
const { Study, Recruit, Like } = require("../db/models");
const dayjs = require('dayjs')

class StudyService {
  constructor(study_model,recruit_model,like_model) {
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
  

  //eager / lazy 알아보기
  //join으로 recruit에 있는 유저아이디를 통해 study 불러오기

//참가중인 스터디
  async getMyAttendingStudy(userId) {
    const now = dayjs()
    const findMyAttendingStudy = await this.Recruit.findAll({
        where:{
            user_id:userId
        },
        include: [
            {
                model: User,
                required: true,
            },
            {
                model: Study,
                required: true,
                where: {
                    end_at: {$lt: now.format('YYYY-MM-DD')}
                }
            }
        ]
    });
    
    return findMyAttendingStudy;
  }

//만료된 스터디
  async getMyExpiredStudy(userId) {
    const now = dayjs()
    const findMyExpiredStudy = await this.Recruit.findAll({
        where:{
            user_id:userId
        },
        include: [
            {
                model: User,
                required: true,
            },
            {
                model: Study,
                required: true,
                where: {
                    end_at: {$gte: now.format('YYYY-MM-DD')}
                }
            }
        ]
    });
    
    return findMyExpiredStudy;
  }





}




const studyService = new StudyService(Study,Recruit,Like)

module.exports = { studyService };

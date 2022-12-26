const { User, Tag } = require("../db");
const { Study, Recruit, Like, Study_tag } = require("../db/models");
const dayjs = require("dayjs");
const { Op } = require("sequelize");

class StudyService {
  constructor(study_model, recruit_model, like_model, study_tag_model) {
    this.Study = study_model;
    this.StudyTag = study_tag_model;
    this.Recruit = recruit_model;
    this.Like = like_model;
  }

  async addStudy(userId,studyData) {
    const startPoint = dayjs(studyData.start_at).format("YYYY-MM-DD");
    const duration = Number(studyData.end_at);
    studyData.end_at = dayjs(startPoint)
      .add(duration, "M")
      .format("YYYY-MM-DD");
    const finalData = {
      ...studyData,
      author: userId
    }
    const createStudy = await this.Study.create(finalData);

    return createStudy;
  }

  async getAllStudy(queryString) {
    console.log(queryString);
    const query = {};
    if (queryString.tag) {
      query.tag_id = queryString.tag.split(",").map((e) => Number(e));
    }
    console.log(query);
    const findAllStudy = await this.Study.findAll({
      where: query,
      include:{
        model: this.StudyTag,
        attributes:['tag_id'],
        include:{
          model:Tag
        }
      },
    });

    return findAllStudy;
  }

  //모임 상세보기 (아이디로 하나만 불러오기 - 포스트맨에서 확인 안됨)
  async getStudyDetail(studyId) {
    const getOneStudy = await this.Study.findOne({
      where: {
        id: Number(studyId),
      },
      include: {
        attributes:['tag_id'],
        model: this.StudyTag,
        include:{
          model: Tag,
        }
      },
    });

    return getOneStudy;
  }

  //찜한 스터디

  async getStudyByLike(userId){
    const studyByLike = this.Study.findAll({
      include:[
        {
          model:this.Like,
          attributes:[],
          where:{
            user_id:Number(userId)
          }
        },
        {
          atrributes:['tag_id'],
          model: this.StudyTag,
          include:{
            model:Tag
          }
        }
      ]
    })

    return studyByLike;
  }

  //모임 삭제
  async deleteMyStudy(studyId,userId) {
    this.Study.destroy({
      where: {
        id: Number(studyId),
        author:Number(userId)
      },
    });
  }

  //수정 필요함!!
  //내 모임 수정
  async patchMyStudy(userId, studyId, updateData) {
    const myStudyList = await this.Recruit.findAll({
      where:{
        user_id:userId,
        study_id:studyId
      },
      attributes:['study_id']
    })
    if(myStudyList){
      const updateStudy = await this.Study.update(updateData.Study, {
        where: {
          id: Number(studyId),
        },
      });
      const updateStudyTag = await this.StudyTag.update(updateData.tag,{
        where: {
          study_id:Number(studyId),
        }
      })
  
      return updateStudy, updateStudyTag;
    }
  }

  //참가중인 스터디
  async getMyAttendingStudy(userId) {
    const now = dayjs();
    const findMyAttendingStudy = await this.Recruit.findAll({
      attributes: [],
      where: {
        user_id: userId,
      },
      include: [
        {
          model: User,
          attributes: [],
        },
        {
          model: Study,
          where: {
            end_at: {
              [Op.gte]: now.format("YYYY-MM-DD"),
            },
          },
          include: {
            model: Study_tag,
            attributes:['tag_id'],
            include:{
              model: Tag,
            }
          },
        },
      ],
    });

    return findMyAttendingStudy.map((e) => {
      return e.Study;
    });
  }

  //만료된 스터디
  async getMyExpiredStudy(userId) {
    const now = dayjs();
    const findMyExpiredStudy = await this.Recruit.findAll({
      atrributes: [],
      where: {
        user_id: userId,
      },
      include: [
        {
          model: User,
          attributes: [],
        },
        {
          model: Study,
          required: true,
          where: {
            end_at: {
              [Op.lt]: now.format("YYYY-MM-DD"),
            },
          },include: {
            model: Study_tag,
            attributes:['tag_id'],
            include:{
              model: Tag,
            }
          },
        },
      ],
    });
    return findMyExpiredStudy.map((e) => {
      return e.Study;
    });
  }
}

// const studyService = new StudyService(Study, Recruit, Like, Study_tag);

module.exports = new StudyService(Study, Recruit, Like, Study_tag);

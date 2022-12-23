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

  async addStudy(studyData) {
    const startPoint = dayjs(studyData.start_at).format("YYYY-MM-DD");
    const duration = Number(studyData.end_at);
    studyData.end_at = dayjs(startPoint)
      .add(duration, "M")
      .format("YYYY-MM-DD");

    const createStudy = await this.Study.create(studyData);

    return createStudy;
  }

  async getAllStudy(queryString) {
    console.log(queryString);
    const query = {};
    if (queryString.tag) {
      query.tag_id = queryString.tag.split(",").map((e) => Number(e));
    }
    console.log(query);
    const findAllStudy = await this.StudyTag.findAll({
      where: query,
      attributes: [],
      include: [
        {
          model: this.Study,
          include:{
            attributes:['tag_id'],
            model: this.StudyTag,
            include:{
              model:Tag
            }
          }
        },
      ],
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
        model: this.Study_tag,
      },
    });
    console.log(getOneStudy);
    return getOneStudy;
  }

  //태그별 스터디
  async getStudyFromTag(tagId) {
    const findStudyTag = await this.Study_tag.findAll({
      where: {
        tag_id: tagId,
      },
    });
    const findTagStudy = await findStudyTag.getStudy();

    return findTagStudy;
  }

  //모임 삭제
  async deleteMyStudy(studyId) {
    this.Study.destroy({
      where: {
        id: Number(studyId),
      },
    });
  }

  //수정 필요함!!
  //내 모임 수정
  async patchMyStudy(userId, studyId, updateData) {
    const updateStudy = this.Study.update(updateData, {
      where: {
        user_id: userId,
        study_id: studyId,
      },
    });

    return updateStudy;
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

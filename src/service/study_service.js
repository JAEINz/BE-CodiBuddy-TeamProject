const { User } = require("../db");
const { Study, Recruit, Like } = require("../db/models");
const dayjs = require("dayjs");
const { Op } = require("sequelize");

class StudyService {
  constructor(study_model, recruit_model, like_model) {
    this.Study = study_model;
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

  async getAllStudy() {
    const findAllStudy = await this.Study.findAll({
        where:{
            id:2
        }
    });

    return findAllStudy;
  }

  //코치님 이부분입니드아!!
  //모임 상세보기 (아이디로 하나만 불러오기 - 포스트맨에서 확인 안됨)
  async getStudyDetail(studyId) {
    const getOneStudy = await this.Study.findOne({
      where: {
        id: Number(studyId),
      }
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

const studyService = new StudyService(Study, Recruit, Like);

module.exports = { studyService };

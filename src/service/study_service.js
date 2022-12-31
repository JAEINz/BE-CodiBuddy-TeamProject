const { User, Tag, Like } = require("../db");
const { Study, Recruit, StudyTag, TagKind } = require("../db/models");
const dayjs = require("dayjs");
const { Op } = require("sequelize");

class StudyService {
  constructor(study_model, recruit_model, study_tag_model, tag_kind_model) {
    this.Study = study_model;
    this.StudyTag = study_tag_model;
    this.Recruit = recruit_model;
    this.TagKind = tag_kind_model;
  }

  async addStudy(userId, studyData) {
    const startPoint = dayjs(studyData.start_at).format("YYYY-MM-DD");
    const duration = Number(studyData.end_at);
    studyData.end_at = dayjs(startPoint)
      .add(duration, "M")
      .format("YYYY-MM-DD");
    const finalData = {
      ...studyData,
      author: userId,
    };
    const createStudy = await this.Study.create(finalData);

    return createStudy;
  }

  async getAllStudy(queryString) {
    const tagQuery = {};
    if (queryString.tag) {
      tagQuery.tag_id = queryString.tag.split(",").map((e) => Number(e));
    }

    const findAllStudy = await this.StudyTag.findAll({
      attributes: ["tag_id"],
      where: tagQuery,
      include: {
        attributes: ["id"],
        model: this.Study,
      },
    })
      .then((studyDatas) => {
        const studyIds = [];
        studyDatas.map((studyData) => {
          if (!(studyIds.includes(studyData.Study.id))) {
            studyIds.push(studyData.Study.id);
          }
        });
        return studyIds;
      })
      .then(async (studyIds) => {
        const study = await this.Study.findAll({
          where: {
            id: studyIds,
          },
          include: [
            {
              model: this.StudyTag,
              include: {
                model: Tag,
              },
            },
            {
              attributes: ["nickname", "profile_image"],
              model: User,
            },
          ],
        });
        return study;
      });

    return findAllStudy;
  }

  //인기/프론트/백/모바일/기타
  //tagKind에서 tagId 다 추출 -> tagId로 studyTag 가져오기 -> studyId로 study 가져오기 (includ)
  async studyByKind(kind) {
    // const positionByStudy = await this.Study.findAll({
    //   where: {
    //     position: kind,
    //   },
    //   include: [
    //     {
    //       model: StudyTag,
    //       include: {
    //         model: Tag,
    //       },
    //     },
    //     { model: User },
    //   ],
    // });
    // return positionByStudy;
    const tagby = await this.TagKind.findAll({
      attributes: ["tag_id"],
      where: {
        kind: kind,
      },
      include: {
        attributes: ["tag_name"],
        model: Tag,
        include: {
          attributes: ["study_id"],
          model: this.StudyTag,
        },
      },
    })
      .then((studyDatas) => {
        const studyIds = [];
        studyDatas.map((studyData) => {
          const studyIdDatas = studyData.Tag.StudyTags;
          studyIdDatas.map((studyId) => {
            if (!(studyId.study_id in studyIds)) {
              studyIds.push(studyId.study_id);
            }
          });
        });

        return studyIds;
      })
      .then(async (studyIds) => {
        const study = await this.Study.findAll({
          where: {
            id: studyIds,
          },
          include: [
            {
              model: this.StudyTag,
              include: {
                model: Tag,
              },
            },
            {
              attributes: ["nickname", "profile_image"],
              model: User,
            },
          ],
        });
        return study;
      });
    return tagby;
  }

  //모임 상세보기 (아이디로 하나만 불러오기 - 포스트맨에서 확인 안됨)
  async getStudyDetail(studyId) {
    const getOneStudy = await this.Study.findOne({
      attributes: { exclude: ["author"] },
      where: {
        id: Number(studyId),
      },
      include: [
        {
          attributes: ["tag_id"],
          model: this.StudyTag,
          include: {
            model: Tag,
          },
        },
        {
          model: User,
          attributes: ["id", "nickname", "profile_image"],
        },
      ],
    });

    return getOneStudy;
  }

  //찜한 스터디

  async getStudyByLike(userId) {
    const studyByLike = this.Study.findAll({
      attributes: { exclude: ["author"] },
      include: [
        {
          model: Like,
          attributes: [],
          where: {
            user_id: Number(userId),
          },
        },
        {
          atrributes: ["tag_id"],
          model: this.StudyTag,
          include: {
            model: Tag,
          },
        },
        {
          model: User,
          attributes: ["id", "nickname", "profile_image"],
        },
      ],
    });

    return studyByLike;
  }

  //모임 삭제
  async deleteMyStudy(studyId, userId) {
    const destroyStudy = await this.Study.destroy({
      where: {
        id: Number(studyId),
        author: Number(userId),
      },
    });
    return destroyStudy;
  }

  //내 모임 수정
  async patchMyStudy(userId, studyId, updateData) {
    const updateStudy = await this.Study.update(updateData, {
      where: {
        id: studyId,
        author: userId,
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
          attributes: { exclude: ["author"] },
          where: {
            end_at: {
              [Op.gte]: now.format("YYYY-MM-DD"),
            },
          },
          include: [
            {
              model: StudyTag,
              attributes: ["tag_id"],
              include: {
                model: Tag,
              },
            },
            {
              model: User,
              attributes: ["id", "nickname", "profile_image"],
            },
          ],
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
          attributes: { exclude: ["author"] },
          required: true,
          where: {
            end_at: {
              [Op.lt]: now.format("YYYY-MM-DD"),
            },
          },
          include: [
            {
              model: StudyTag,
              attributes: ["tag_id"],
              include: {
                model: Tag,
              },
            },
            {
              model: User,
              attributes: ["id", "nickname", "profile_image"],
            },
          ],
        },
      ],
    });
    return findMyExpiredStudy.map((e) => {
      return e.Study;
    });
  }
}

module.exports = new StudyService(Study, Recruit, StudyTag, TagKind);

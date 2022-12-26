const { Study } = require("../db");
const { Study_tag, Tag } = require("../db/models");

class StudyTagService {
  constructor(StudyTag_model, Tag_model) {
    this.StudyTag = StudyTag_model;
    this.Tag = Tag_model;
  }

  //study_tag 생성
  async addStudyTag(tag, studyId) {
    const studyTags = await this.Tag.findAll({
      where: {
        tag_name: tag,
      },
      attributes: ["id"],
    });
    const tagIdList = [];
    studyTags.map((e) => tagIdList.push(e.dataValues.id));
    tagIdList.map(async (e) => {
      const a = {
        tag_id: e,
        study_id: studyId,
      };
      await this.StudyTag.create(a);
    });
  }
  // study_tag 보기 (study id = studyId 인 태그 모두 가져오기)
  async getFromStudy(studyId) {
    const findFromStudy = this.StudyTag.findAll({
      where: {
        study_id: studyId,
      },
      attributes: [],
      include: {
        model: Tag,
      },
    });
    console.log("get 끝");
    return findFromStudy;
  }

  //tag로 스터디 찾기
  async getFromTagStudy(tag) {
    const findFromTag = tag.map(async (e) => {
      await this.StudyTag.findAll({
        where: {
          tag_name: e,
        },
      });
    });

    return findFromTag;
  }

  //studyTag 삭제
  async deleteStudyTag(studyId) {
    const deleteMyStudyTag = await this.StudyTag.destroy({
      where: {
        study_id: studyId,
      },
    });

    return deleteMyStudyTag;
  }
}

module.exports = new StudyTagService(Study_tag, Tag);

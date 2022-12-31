const { UserTag } = require("../db");
const { Tag } = require("../db/models");


class UserTagService {
    constructor(UserTag_model, Tag_model) {
      this.UserTag = UserTag_model;
      this.Tag = Tag_model;
    }
  
    //UserTag 생성
    async addUserTag(tag, userId) {
      const userTags = await this.Tag.findAll({
        where: {
          tag_name: tag,
        },
        attributes: ["id"],
      });
      const tagIdList = [];
      userTags.map((e) => tagIdList.push(e.dataValues.id));
      tagIdList.map(async (e) => {
        const a = {
          tag_id: e,
          user_id: userId,
        };
        await this.UserTag.create(a);
      });
    }
    // UserTag 보기 (user id = userId 인 태그 모두 가져오기)
    async getFromUser(userId) {
      const findFromUser = this.UserTag.findAll({
        where: {
          user_id: userId,
        },
        attributes: [],
        include: {
          model: Tag,
        },
      });
      return findFromUser;
    }
  
    //tag로 스터디 찾기
    async getFromTagUser(tag) {
      const findFromTag = tag.map(async (e) => {
        await this.UserTag.findAll({
          where: {
            tag_name: e,
          },
        });
      });
  
      return findFromTag;
    }
  
    //studyTag 삭제
    async deleteUserTag(userId) {
      const deleteMyUserTag = await this.UserTag.destroy({
        where: {
          user_id: userId,
        },
      });
  
      return deleteMyUserTag;
    }

  }
  
  module.exports = new UserTagService(UserTag, Tag);
  
const { Comment } = require("../db/models");
const { User } = require("../db");

class CommentService {
  constructor(comment_model) {
    this.Comment = comment_model;
  }

  //코멘트 추가
  async addComment(userId, commentData) {
    const createComment = await this.Comment.create({
      ...commentData,
      user_id: userId,
    });
    return createComment;
  }

  //코멘트 삭제
  async deleteMyComment(userId, commentId) {
    const deleteComment = await this.Comment.destroy({
      where: {
        id: commentId,
        user_id: userId,
      },
    });
    return deleteComment;
  }

  //코멘트 수정
  async updateComment(userId, commentId, updateComment) {
    const updateMyComment = await this.Comment.update(updateComment, {
      where: {
        id: commentId,
        user_id: userId,
      },
    });
    return updateMyComment;
  }

  //스터디 댓글 보기
  async getComment(queryString, studyId) {
    const condition = {
      include: {
        model: User,
        attributes: ["nickname", "profile_image"],
      },
      where: {
        study_id: Number(studyId),
      },
      order: [["createdAt", "DESC"],],
    };
    if (queryString.user) {
      condition.include.where = {
        nickname: queryString.user,
      };
    }
    try {
      const findComment = await this.Comment.findAll(condition);
      return findComment;
    } catch (err) {
      console.log(err);
    }
  }
}

module.exports = new CommentService(Comment);

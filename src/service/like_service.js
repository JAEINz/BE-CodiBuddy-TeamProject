const { Like } = require("../db/models");

class LikeService {
  constructor( like_model ) {
    this.Like = like_model;
  }

  async addLike(userId, studyId){
    const createLike = await this.Like.findOrCreate({
      where:{
        user_id: userId,
        study_id: studyId
      },
      defaults:{
        user_id:userId,
        study_id:studyId
      }
    })
    return createLike;
  }

  async deleteMyLike(userId, studyId){
    const deleteLike = await this.Like.destroy({
        where:{
            user_id: userId,
            study_id: studyId
        }
    })
    return deleteLike;
  }
}

module.exports = new LikeService(Like);
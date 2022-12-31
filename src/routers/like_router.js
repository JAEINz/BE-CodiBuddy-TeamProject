const express = require("express");
const { loginRequired } = require("../middlewares/login_required");
const likeRouter = express.Router();

const { likeService } = require("../service");

//찜하기
likeRouter.post("/:study_id", loginRequired, async (req, res, next) => {
    try {
      const userId = req.userId;
      const studyId = req.params.study_id;
      const newLike = await likeService.addLike(userId,studyId);
      if(newLike[1]){
        res.status(201).json(newLike);
      }else{
        res.status(405).json({
          reason: '이미 찜한 모임입니다..',
          result: 'method-not-allowed',
        });
      }
  
    } catch (error) {
      next(error);
    }
});

//찜 삭제하기
likeRouter.delete("/:study_id", loginRequired, async (req, res, next) => {
    try {
      const userId = req.userId;
      const studyId = req.params.study_id;
      const deleteLike = await likeService.deleteMyLike(userId,studyId);
  
      res.status(201).json(deleteLike);
    } catch (error) {
      next(error);
    }
});


  module.exports = likeRouter;
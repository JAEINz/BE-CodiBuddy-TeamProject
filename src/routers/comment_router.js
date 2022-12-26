const express = require("express");
const { loginRequired } = require("../middlewares/login_required");
const commentRouter = express.Router();

const { commentService } = require("../service");

//댓글 쓰기
commentRouter.post("/", loginRequired, async (req, res, next) => {
  try {
    const userId = req.userId;
    const commentData = req.body;
    const newComment = await commentService.addComment(userId, commentData);

    res.status(201).json(newComment);
  } catch (error) {
    next(error);
  }
});

//댓글 삭제하기
commentRouter.delete("/:comment_id", loginRequired, async (req, res, next) => {
  try {
    const userId = req.userId;
    const commentId = req.params.comment_id;
    const deleteComment = await commentService.deleteMyComment(
      userId,
      commentId
    );

    res.status(201).json(deleteComment);
  } catch (error) {
    next(error);
  }
});

//댓글 수정하기
commentRouter.patch("/:comment_id", loginRequired, async (req, res, next) => {
  try {
    const userId = req.userId;
    const commentId = req.params.comment_id;
    const updateComment = req.body;
    const patchComment = await commentService.updateComment(userId, commentId, updateComment);

    res.status(201).json(patchComment);
  } catch (error) {
    next(error);
  }
});

//스터디 댓글 조회하기 (유저 닉네임으로 조회 가능)
commentRouter.get("/:study_id", async (req, res, next) => {
  try {
    const studyId = req.params.study_id;
    const findComment = await commentService.getComment(req.query, studyId);

    res.status(200).json(findComment);
  } catch (error) {
    next(error);
  }
});

module.exports = commentRouter;

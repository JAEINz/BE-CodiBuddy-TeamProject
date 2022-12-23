const express = require("express");
const studyRouter = express.Router();

const { studyService, recruitService, studyTagService } = require("../service");

//스터디 생성 (완료)<recruit, study, study_tag 생성>
studyRouter.post("/", async (req, res, next) => {
  try {
    const userId = 1;
    const studyData = req.body.study;
    const tag = req.body.tag;
    const newStudy = await studyService.addStudy(studyData);
    const studyId = newStudy.dataValues.id;
    await recruitService.addRecruit(userId, studyId);
    await studyTagService.addStudyTag(tag, studyId);
    const studyTag = await studyTagService.getFromStudy(studyId)

    res.status(201).json({"study":newStudy,studyTag});
  } catch (error) {
    next(error);
  }
});

//모든 스터디 불러오기(태그별 가능) (완료)<study, study_tag>
studyRouter.get("/", async (req, res, next) => {
  try {
    const allStudyList = await studyService.getAllStudy(req.query);
    res.status(200).json(allStudyList);
  } catch (error) {
    next(error);
  }
});

//참가중인 스터디 (완료)
// studyRouter.get("/mystudy", loginRequired, async (req,res,next)=> {
studyRouter.get("/mystudy/attend", async (req, res, next) => {
  try {
    // const userId = req.currentUserId;
    const userId = 1;
    const myAttendingStudyList =
      await studyService.getMyAttendingStudy(userId);
    res.status(200).json(myAttendingStudyList);
  } catch (error) {
    next(error);
  }
});

//만료된 스터디 (완료)
studyRouter.get("/mystudy/expire", async (req, res, next) => {
  try {
    // const userId = req.currentUserId;
    const userId = 1;
    const myExpiredStudyList =
      await studyService.getMyExpiredStudy(userId);
    res.status(200).json(myExpiredStudyList);
  } catch (error) {
    next(error);
  }
});

//태그별 스터디 불러오기 (태그리스트를 어떻게 불러올까요!)
studyRouter.get("/tag", async (req, res, next) => {
  try {
    const tag = []
    const tagForStudy = await studyService.getStudyFromTag(tag);
    res.status(200).json(tagForStudy);
  } catch (error) {
    next(error);
  }
});


//스터디 상세 보기
studyRouter.get("/:study_id", async (req, res, next) => {
  try {
    const studyId = req.params.study_id;
    const studyDetail = await studyService.getStudyDetail(studyId);
    res.status(200).json(studyDetail);
  } catch (error) {
    next(error);
  }
});

//내 스터디 수정
studyRouter.patch("/:study_id", async (req, res, next) => {
  try {
    const userId = req.currentUserId;
    const studyId = req.params.study_id;
    const updateData = req.body;
    const updateStudy = await studyService.patchMyStudy(
      userId,
      studyId,
      updateData
    );
    res.status(200).json(updateStudy);
  } catch (error) {
    next(error);
  }
});

//내 스터디 삭제 (완료)
studyRouter.delete("/:study_id", async (req, res, next) => {
  try {
    // const userId = req.currentUserId;
    const userId = 1;
    const studyId = req.params.study_id;
    //리쿠르트 삭제
    await recruitService.deleteMyRecruit(userId, studyId);
    const deleteStudy = await studyService.deleteMyStudy(studyId);

    res.status(200).json(deleteStudy);
  } catch (error) {
    next(error);
  }
});

module.exports = studyRouter;

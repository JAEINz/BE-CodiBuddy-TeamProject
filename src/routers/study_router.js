const express = require("express");
const { loginRequired } = require("../middlewares/login_required");
const studyRouter = express.Router();

const { studyService, recruitService, studyTagService } = require("../service");


//스터디 생성 (완료)<recruit, study, StudyTag 생성>
studyRouter.post("/", loginRequired, async (req, res, next) => {
  try {
    const userId = req.userId;
    const studyData = req.body.study;
    const tag = req.body.tag;
    const newStudy = await studyService.addStudy(userId,studyData);
    const studyId = newStudy.id;
    await studyTagService.addStudyTag(tag, studyId);

    res.status(201).json({'studyId':studyId});
  } catch (error) {
    next(error);
  }
});

//모든 스터디 불러오기(태그별 가능) (완료)<study, StudyTag>
studyRouter.get("/", async (req, res, next) => {
  try {
    const allStudyList = await studyService.getAllStudy(req.query);
    res.status(200).json(allStudyList);
  } catch (error) {
    next(error);
  }
});

//모든 스터디 불러오기(태그별 가능) (완료)<study, StudyTag>
studyRouter.get("/kind/:kind", async (req, res, next) => {
  try {
    const allStudyByKind = await studyService.studyByKind(req.params.kind);
    res.status(200).json(allStudyByKind);
  } catch (error) {
    next(error);
  }
});

//참가중인 스터디 (완료)
// studyRouter.get("/mystudy", loginRequired, async (req,res,next)=> {
studyRouter.get("/mystudy/attend", loginRequired, async (req, res, next) => {
  try {
    const userId = req.userId;
    const myAttendingStudyList =
      await studyService.getMyAttendingStudy(userId);
    res.status(200).json(myAttendingStudyList);
  } catch (error) {
    next(error);
  }
});

//만료된 스터디 (완료)
studyRouter.get("/mystudy/expire", loginRequired, async (req, res, next) => {
  try {
    const userId = req.userId;
    const myExpiredStudyList =
      await studyService.getMyExpiredStudy(userId);
    res.status(200).json(myExpiredStudyList);
  } catch (error) {
    next(error);
  }
});


//스터디 하나만 가져오기
studyRouter.get("/:study_id",  async (req, res, next) => {
  try {
      const studyId = req.params.study_id;
    const studyDetail = await studyService.getStudyDetail(studyId);
    res.status(200).json(studyDetail);
  } catch (error) {
    next(error);
  }
});

//찜한 스터디 가져오기 (완료)
studyRouter.get("/mystudy/like", loginRequired, async (req,res,next)=>{
    try{
        const userId = req.userId;
        const studyByLike = await studyService.getStudyByLike(userId);
        res.status(200).json(studyByLike)
    }catch(error){
        next(error)
    }
})

//내 스터디 수정
studyRouter.patch("/:study_id", loginRequired, async (req, res, next) => {
  try {
    const userId = req.userId;
    const studyId = req.params.study_id;
    const updateData = req.body.Study;
    const tagData = req.body.Tag;
    const updateStudy = await studyService.patchMyStudy(
      userId,
      studyId,
      updateData
    );
    await studyTagService.deleteStudyTag(studyId);
    await studyTagService.addStudyTag(tagData, studyId);

    res.status(200).json(updateStudy);
  } catch (error) {
    next(error);
  }
});

//스터디 삭제 (완료)
studyRouter.delete("/:study_id", loginRequired, async (req, res, next) => {
  try {
    const userId = req.userId;
    const studyId = req.params.study_id;

    const deletStudy = await studyService.deleteMyStudy(studyId,userId);

    res.status(201).json(deletStudy);
  } catch (error) {
    next(error);
  }
});

module.exports = studyRouter;

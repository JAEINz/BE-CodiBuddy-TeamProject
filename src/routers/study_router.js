const express = require("express");
const studyRouter = express.Router();

const { studyService, Recruit, Like } = require("../service");

//스터디 생성
studyRouter.post("/register", async (req, res, next) => {
  try {
    const start_at = req.body.start_at;
    const end_at = req.body.end_at;
    const is_online = req.body.is_online;
    const title = req.body.title;
    const contents = req.body.contents;
    const position = req.body.position;
    const price = req.body.price;

    const newStudy = await studyService.studyService.addStudy({
      start_at,
      end_at,
      is_online,
      title,
      contents,
      position,
      price,
    });

    res.status(201).json(newStudy);
  } catch (error) {
    next(error);
  }
});

//모든 스터디 불러오기
studyRouter.get("/", async (req,res,next)=> {
    try{

        const allStudyList = await studyService.studyService.getAllStudy();
        res.status(200).json(allStudyList);

    }catch(error){
        next(error)
    }
})

//내 스터디 전체리스트만 가져오기 (loginrequired)
// studyRouter.get("/mystudy", loginRequired, async (req,res,next)=> {
studyRouter.get("/mystudy", async (req,res,next)=> {
    try{
        const userId = req.currentUserId;
        const myStudyList = await studyService.studyService.getMyStudy(userId);
        res.status(200).json(myStudyList);
    }catch(error){
        next(error)
    }
})

//상태에 따라 참가 / 안참가하는...
//찜한 스터디 읽어오기
module.exports = studyRouter;

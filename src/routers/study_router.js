const express = require("express");
const studyRouter = express.Router();

const { studyService } = require("../service");

//스터디 생성
studyRouter.post("register", async (req, res, next) => {
  try {
    const start_at = req.body.start_at;
    const end_at = req.body.end_at;
    const is_online = req.body.is_online;
    const title = req.body.title;
    const contents = req.body.contents;
    const position = req.body.position;
    const price = req.body.price;

    const newStudy = await studyService.addStudy({
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

//스터디 전체 리스트 읽어오기

//userid별 스터디 리스트 읽어오기
//상태에 따라 참가 / 안참가하는...
//찜한 스터디 읽어오기
module.exports = studyRouter;

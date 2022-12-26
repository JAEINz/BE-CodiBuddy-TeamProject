const express = require("express");
const tagRouter = express.Router();

const { tagService } = require("../service");

//태그 조회하기
tagRouter.get("/", async (req, res, next) => {
    try {
      const tag = await tagService.getTag();
  
      res.status(201).json(tag);
    } catch (error) {
      next(error);
    }
});

module.exports = tagRouter;
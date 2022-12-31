const express = require("express");
const tagRouter = express.Router();

const { tagService } = require("../service");

//태그 조회하기
tagRouter.get("/:kind", async (req, res, next) => {
    try {
      const kind = req.params.kind;
      const tag = await tagService.getTag(kind);
  
      res.status(200).json(tag);
    } catch (error) {
      next(error);
    }
});
tagRouter.post("/", async (req, res, next) => {
    try {
      const tag = await tagService.addTag();
  
      res.status(201).json(tag);
    } catch (error) {
      next(error);
    }
});

module.exports = tagRouter;
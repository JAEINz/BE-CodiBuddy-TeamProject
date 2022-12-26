const { Tag } = require("../db/models");

class TagService {
  constructor(Tag_model) {
    this.Tag = Tag_model;
  }

  async getTag() {
    const findAllTag = this.Tag.findAll({});

    return findAllTag;
  }

}

module.exports = new TagService(Tag);
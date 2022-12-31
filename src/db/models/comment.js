const Sequelize = require("sequelize");

module.exports = class Comment extends Sequelize.Model {
  static init(sequelize) {
    return super.init(
      {
        id:{
          type: Sequelize.INTEGER,
          allowNull:false,
          primaryKey: true,
          autoIncrement: true,
        },
        study_id: {
          type: Sequelize.INTEGER,
          allowNull:false,
        },
        user_id: {
          type: Sequelize.INTEGER,
          allowNull:false,
        },
        commentary: {
          type: Sequelize.TEXT("tiny"),
          allowNull: false,
        },
      },
      {
        sequelize,
        timestamps: true, //creatat+delete
        underscored: true, //스네이크케이스로 이름변경
        modelName: "Comment",
        tableName: "comments",
        paranoid: false, //삭제시 완전삭제x -> 로그남김
        charset: "utf8",
        collate: "utf8_general_ci",
      }
    );
  }
};

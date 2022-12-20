const Sequelize = require('sequelize');

module.exports = class Study_tag extends Sequelize.Model {
    static init(sequelize) {
      return super.init({
        tag_id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            primaryKey: true
        },
        study_id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            primaryKey: true
        },
      }, {
      sequelize,
      timestamps: false, //creatat+delete
      underscored: true, //스네이크케이스로 이름변경
      modelName: 'Study_tag',
      tableName: 'study_tags',
      paranoid: false, //삭제시 완전삭제x -> 로그남김
      charset: 'utf8',
      collate: 'utf8_general_ci',
    });
    }
}
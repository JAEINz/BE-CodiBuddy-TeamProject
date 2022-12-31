const Sequelize = require('sequelize');

module.exports = class StudyTag extends Sequelize.Model {
    static init(sequelize) {
      return super.init({
        id:{
          type: Sequelize.INTEGER,
          allowNull:false,
          primaryKey: true,
          autoIncrement: true,
        },
        tag_id: {
            type: Sequelize.INTEGER,
            allowNull: false,
        },
        study_id: {
            type: Sequelize.INTEGER,
            allowNull: false,
        },
      }, {
      sequelize,
      timestamps: false, //creatat+delete
      underscored: true, //스네이크케이스로 이름변경
      modelName: 'StudyTag',
      tableName: 'studytags',
      paranoid: false, //삭제시 완전삭제x -> 로그남김
      charset: 'utf8',
      collate: 'utf8_general_ci',
    });
    }
}
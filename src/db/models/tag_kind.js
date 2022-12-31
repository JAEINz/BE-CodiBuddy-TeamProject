const Sequelize = require('sequelize');

module.exports = class TagKind extends Sequelize.Model {
  static init(sequelize) {
    return super.init({
      kind:{
        type: Sequelize.ENUM('popular','front_end','back_end','mobile','etc'),
        allowNul: true,
      },
    }, {
      sequelize,
      timestamps: false, //creatat+deleteat
      underscored: true, //스네이크케이스로 이름변경
      modelName: 'TagKind',
      tableName: 'tagkinds',
      paranoid: false, //삭제시 완전삭제x 로그남김
      charset: 'utf8',
      collate: 'utf8_general_ci',
    });
  }
};
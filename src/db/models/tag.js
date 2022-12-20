const Sequelize = require('sequelize');

module.exports = class Tag extends Sequelize.Model {
  static init(sequelize) {
    return super.init({
      tag_name: {
        type: Sequelize.STRING(45),
        allowNull: false,
        unique: true,
      },
      tag_image: {
        type: Sequelize.STRING(200),
        allowNull: true,
      },
    }, {
      sequelize,
      timestamps: false, //creatat+deleteat
      underscored: true, //스네이크케이스로 이름변경
      modelName: 'Tag',
      tableName: 'tags',
      paranoid: false, //삭제시 완전삭제x 로그남김
      charset: 'utf8',
      collate: 'utf8_general_ci',
    });
  }

  static associate(db){
    db.Tag.hasMany(db.User_tag, { foreignKey: 'tag_id', sourceKey: 'id'});
    db.Tag.hasMany(db.Study_tag, { foreignKey: 'tag_id', sourceKey: 'id'});
  }
};
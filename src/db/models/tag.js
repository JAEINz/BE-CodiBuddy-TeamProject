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
      popular:{
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
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
    db.Tag.hasMany(db.UserTag, { foreignKey: 'tag_id', sourceKey: 'id'});
    db.UserTag.belongsTo(db.Tag);
    db.Tag.hasMany(db.StudyTag, { foreignKey: 'tag_id', sourceKey: 'id'});
    db.StudyTag.belongsTo(db.Tag);
    db.Tag.hasMany(db.TagKind, { foreignKey: 'tag_id', sourceKey: 'id'});
    db.TagKind.belongsTo(db.Tag);
  }
};
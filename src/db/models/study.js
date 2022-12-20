const Sequelize = require('sequelize');

module.exports = class User extends Sequelize.Model {
  static init(sequelize) {
    return super.init({
      start_at: {
        type: Sequelize.DATEONLY,
        allowNull: false,
      },
      end_at: {
        type: Sequelize.DATEONLY,
        allowNull: false,
      },
      is_online: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
      },
      title: {
        type: Sequelize.STRING(20),
        allowNull: false,
      },
      contents: {
        type: Sequelize.TEXT('medium'),
        allowNull: false,
      },
      position: {
        type: Sequelize.ENUM('front-end', 'back-end', 'fullstack'),
        allowNull: false,
      },
      price: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
    }, {
      sequelize,
      timestamps: false, //creatat+delete
      underscored: true, //스네이크케이스로 이름변경
      modelName: 'Study',
      tableName: 'studies',
      paranoid: false, //삭제시 완전삭제x -> 로그남김
      charset: 'utf8',
      collate: 'utf8_general_ci',
    });
  }

  static associate(db){
    db.Study.hasMany(db.Study_tag, { foreignKey: 'study_id', sourceKey: 'id'});
    // db.Study.belongsto()
    db.Study.hasMany(db.Like, { foreignKey: 'study_id', sourceKey: 'id'});
    db.Study.hasMany(db.Recruit, { foreignKey: 'study_id', sourceKey: 'id'});
  }

};
const Sequelize = require('sequelize');

module.exports = class Recruit extends Sequelize.Model {
    static init(sequelize) {
      return super.init({
        user_id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            primaryKey: true
        },
        study_id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            primaryKey: true
        },
        payment_status: {
            type: Sequelize.ENUM('예정','승인','거절','완료'),
            defaultValue: '예정'
        }
      }, {
      sequelize,
      timestamps: false, //creatat+delete
      underscored: true, //스네이크케이스로 이름변경
      modelName: 'Recruit',
      tableName: 'recruits',
      paranoid: false, //삭제시 완전삭제x -> 로그남김
      charset: 'utf8',
      collate: 'utf8_general_ci',
    });
    }
}
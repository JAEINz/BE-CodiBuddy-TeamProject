module.exports = (sequelize, DataTypes)=>{
    const Like = sequelize.define('Like', { 
        // id는 mysql에서 자동으로 생성되기 때문에 넣어줄 필요 없다.
        // id: {},
        user_id: {
            type:DataTypes.INTEGER, 
           // 자주사용되는 자료형 STRING, TEXT, BOOLEAN, INTEGER, FLOAT, DATETIME
            allowNull: false, //필수값
        },
        study_id: {
            type:DataTypes.INTEGER, //20에서 40으로 수정해야하나?
            allowNull: false, //필수값
        }
    });
    Like.associate = (db) => {};
    return Like;
}
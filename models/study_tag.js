module.exports = (sequelize, DataTypes)=>{
    const StudyTag = sequelize.define('StudyTag', { 
        // id는 mysql에서 자동으로 생성되기 때문에 넣어줄 필요 없다.
        // id: {},
        study_id: {
            type:DataTypes.INTEGER, 
           // 자주사용되는 자료형 STRING, TEXT, BOOLEAN, INTEGER, FLOAT, DATETIME
            allowNull: false, //필수값
        },
        tag_id: {
            type:DataTypes.INTEGER,
            allowNull: false, //필수값
        }
    });
    StudyTag.associate = (db) => {};
    return StudyTag;
}
module.exports = (sequelize, DataTypes)=>{
    const Tag = sequelize.define('Tag', { 
        // id는 mysql에서 자동으로 생성되기 때문에 넣어줄 필요 없다.
        // id: {},
        tag_name: {
            type:DataTypes.STRING(45), 
           // 자주사용되는 자료형 STRING, TEXT, BOOLEAN, INTEGER, FLOAT, DATETIME
            allowNull: false, //필수값
        },
        tag_image: {
            type:DataTypes.STRING(200),
            allowNull: true, //필수값
        }
    });
    Tag.associate = (db) => {};
    return Tag;
}
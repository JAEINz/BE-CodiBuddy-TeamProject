module.exports = (sequelize, DataTypes)=>{
    const Study = sequelize.define('Study', { 
        // id는 mysql에서 자동으로 생성되기 때문에 넣어줄 필요 없다.
        // id: {},
        start_at: {
            type:DataTypes.DATE, 
           // 자주사용되는 자료형 STRING, TEXT, BOOLEAN, INTEGER, FLOAT, DATETIME
            allowNull: false, //필수값
        },
        end_at: {
            type:DataTypes.DATE,
            allowNull: false, //필수값
        },
        is_online: {
            type:DataTypes.tinyint, //tinyint써도되나??
            allowNull: false, //필수값
        },
        title: {
            type:DataTypes.STRING(45),
            allowNull: false, //필수값
        },
        contents: {
            type:DataTypes.STRING(45), //mediumtext인데 뭐라고 해야하지
            allowNull: false, //필수값
        },
        position: {
            type:DataTypes.STRING(15),
            allowNull: false, //필수값
        },
        price: {
            type:DataTypes.INTEGER,
            allowNull: false, //필수값
        }
    });
    Study.associate = (db) => {};
    return Study;
}
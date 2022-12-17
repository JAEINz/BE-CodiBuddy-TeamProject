module.exports = (sequelize, DataTypes)=>{
    const User = sequelize.define('User', { // MySQL에는 users라는 테이블 생성
        // id는 mysql에서 자동으로 생성되기 때문에 넣어줄 필요 없다.
        // id: {},
        user_id: {
            type:DataTypes.STRING(20), //varchar인데 string으로 쓰는건가??
           // 자주사용되는 자료형 STRING, TEXT, BOOLEAN, INTEGER, FLOAT, DATETIME
            allowNull: false, //필수값
            unique: true //고유값
        },
        user_pw: {
            // 패스워드는 암호화를 하기 때문에 넉넉하게 잡아주는 것이 좋다. 
            type:DataTypes.STRING(40), //20에서 40으로 수정해야하나?
            allowNull: false, //필수값
        },
        nickname: {
            type:DataTypes.STRING(10),
            allowNull: false, //필수값
        },
        email: {
            type:DataTypes.STRING(50),
            allowNull: false, //필수값
        },
        nickname: {
            type:DataTypes.tinytexy, //여기서도 tinytext타입이 가능한가??
            allowNull: true //필수값
        },
        profile_image: {
            type:DataTypes.STRING(200),
            allowNull: true, //필수값
        },
    },{
        // 한글을 쓸수 있게 해준다.(한글 저장)
        charset: 'utf8',
        collate: 'utf8_general_ci' 
    });
    User.associate = (db) => {};
    return User;
}
//models/index.js
const Sequelize = require('sequelize');
const {Tag, TagKind, User, Study, UserTag, StudyTag, Like, Recruit, Comment, UserRefreshToken} = require('./models')
const env = process.env.NODE_ENV || 'development';
const config = require('../../config/config')[env];
const db = {};

const sequelize = new Sequelize(config.database, config.username, config.password, config);

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.Tag = Tag;
db.TagKind = TagKind;
db.User = User;
db.UserRefreshToken = UserRefreshToken;
db.Study = Study;
db.UserTag = UserTag;
db.StudyTag = StudyTag;
db.Like = Like;
db.Recruit = Recruit;
db.Comment = Comment;

Tag.init(sequelize);
TagKind.init(sequelize);
Study.init(sequelize);
User.init(sequelize);
UserRefreshToken.init(sequelize);
UserTag.init(sequelize);
StudyTag.init(sequelize);
Like.init(sequelize);
Recruit.init(sequelize);
Comment.init(sequelize);

Tag.associate(db)
User.associate(db)
Study.associate(db)


module.exports = db;
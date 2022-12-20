//models/index.js
const Sequelize = require('sequelize');
const {Tag, User, Study, User_tag, Study_tag, Like, Recruit} = require('./models')
const env = process.env.NODE_ENV || 'development';
const config = require('../../config/config')[env];
const db = {};

const sequelize = new Sequelize(config.database, config.username, config.password, config);

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.Tag = Tag;
db.User = User;
db.Study = Study;
db.User_tag = User_tag;
db.Study_tag = Study_tag;
db.Like = Like;
db.Recruit = Recruit;

Tag.init(sequelize);
User.init(sequelize);
Study.init(sequelize);
User_tag.init(sequelize);
Study_tag.init(sequelize);
Like.init(sequelize);
Recruit.init(sequelize);

Tag.associate(db)
User.associate(db)
Study.associate(db)


module.exports = db;
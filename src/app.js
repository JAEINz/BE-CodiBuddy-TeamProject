//app.js
const express = require('express');
const { studyRouter, userRouter, likeRouter, recruitRouter, commentRouter, tagRouter } = require('./routers')
const path = require('path');
const morgan = require('morgan');

const { sequelize } = require('./db');

const app = express();


sequelize.sync({ force: false })
  .then(() => {
    console.log('데이터베이스 연결 성공');
  })
  .catch((err) => {
    console.error(err);
  });

app.use(morgan('dev'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/api/study', studyRouter)
app.use('/api/user', userRouter)
app.use('/api/like', likeRouter)
app.use('/api/recruit', recruitRouter)
app.use('/api/comment', commentRouter)
app.use('/api/tag', tagRouter)

module.exports = { app }
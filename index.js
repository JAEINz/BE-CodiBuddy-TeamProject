const { app } = require('./src/app.js')
require('dotenv').config();

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
    console.log(PORT, '번 포트에서 대기중');
  });
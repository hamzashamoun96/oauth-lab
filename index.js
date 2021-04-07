'use strict';
require('dotenv').config();


const mongoose = require('mongoose');
const options = {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
};
mongoose.connect(process.env.MONGODB_URI, options).then(() => {
  require('./src/server.js').start(process.env.PORT);
}).catch((err) => {
  console.log('CONNECTION_ERROR', err.message)
})
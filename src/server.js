'use strict';

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const notFoundHandler = require('../src/error-handlers/404.js');
const errorHandler = require('../src/error-handlers/500.js');
const logger = require('./middleware/logger.js');
const aouth = require('./middleware/oauth.js')

const v1Routes = require('./routes/v1.js');
const authRoutes = require('./routes/routes.js');

const app = express();
app.use(express.json());
app.use(express.static('./public'))
app.use(express.urlencoded({ extended: true }));
app.use(logger);
app.use(cors());
app.get('/auth_', aouth, (req, res) => {
  console.log("ROUTEEEEEEEEEEEEEEEEE")
  res.json({ token: req.token })
})
app.use(morgan('dev'));

app.use(v1Routes);
app.use(authRoutes);
app.use('*', notFoundHandler);
app.use(errorHandler);




module.exports = {
  server: app,
  start: port => {
    if (!port) { throw new Error("Missing Port"); }
    app.listen(port, () => console.log(`Listening on ${port}`));
  },
};
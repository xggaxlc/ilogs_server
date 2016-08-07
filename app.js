'use strict';

const http = require('http');
const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const config = require('./config/environment');

mongoose.Promise = require('q').Promise;
mongoose.connect(config.mongo.uri, config.mongo.options);
mongoose.connection.on('error', function(err) {
  console.error(`MongoDB connection error: ${err}`);
  process.exit(-1);
});

if (config.seedDB) {
  require('./config/seed');
}

let app = express();
let server = http.createServer(app);

app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(bodyParser.json());
app.use(morgan('dev'));

//跨域支持
app.use(cors());

//在bodyParser中间件之后
require('./router/v1')(app);

function startServer() {
  server.listen(config.port, config.ip, function() {
    console.log(`Server listening on %d, in %s mode`, config.port, app.get('env'));
  });
}

setImmediate(startServer);
module.exports = app;
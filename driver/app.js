var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const mongoose = require('mongoose');
const config = require('config');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/instrument');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (error, req, res, next) {
  let message = null;
  let status = 500;
  if (error.errors) {
    return res.status(400).send(error);
  }
  if (error instanceof Object) {
    if (error.message && error.status && error) {
      message = {
        message: error.message,
        stack: stringifyError(error),
      };
      status = error.status;
    } else
      message = {
        message: 'internal server error',
        stack: stringifyError(error),
      };
  } else if (typeof error == 'string' && !error.includes('Error')) {
    message = {
      message: error,
    };
  } else {
    message = {
      message: 'internal server error',
      stack: stringifyError(error),
    };
  }
  return res.status(status).send(message);
});

const stringifyError = function (err, filter, space) {
  const plainObject = {};
  Object.getOwnPropertyNames(err).forEach(function (key) {
    plainObject[key] = err[key];
  });
  return JSON.stringify(plainObject, filter, space);
};

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

mongoose
  .connect(config.mongo_uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(function (data) {
    console.log('connected to mongodb');
  })
  .catch(function (error) {
    console.log(error);
  });

mongoose.connection.on('error', (err) => {
  console.log(err);
});

module.exports = app;

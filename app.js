const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mongoose = require('mongoose');

// Importing the routes
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');

// Initializing the express app
const app = express();

// Set up mongoose connection
mongoose.set('strictQuery', false);
const mongoDB =
  'mongodb+srv://myAtlasDBUser:test123@myatlasclusteredu.8ul4ofr.mongodb.net/odin-inventoryApplication?retryWrites=true&w=majority';

// Wait for database to connect, logging an error if there is a problem
async function connectToDB() {
  await mongoose.connect(mongoDB);
}

connectToDB().catch((err) => console.log(err));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// Setting up the middleware
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Declaring the routes
app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;

"use strict";

const express = require("express");
const bodyParser = require("body-parser");
const createError = require("http-errors");
var path = require('path');
var logger = require('morgan');

const indexRouter = require("./routes/index");
const moviesRouter = require("./routes/movies");

const app = express();

// view engine setup
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");
app.use(logger("dev"));
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.json());

app.use('/', indexRouter);
app.use("/get-movie-details", moviesRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};
  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

app.listen(process.env.PORT || 8000, () => {
  console.log("Server is up and running...");
});

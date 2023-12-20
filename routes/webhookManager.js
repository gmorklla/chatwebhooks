const express = require("express");
const router = express.Router();

const moviesRes = require("../intents/movies");
const transferRes = require("../intents/transfer");

router.all("/*", (req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  res.header(
    "Access-Control-Allow-Headers",
    "Content-Type, responseType, Authorization"
  );
  res.header("Access-Control-Allow-Methods", "OPTIONS, POST, GET");
  next();
});

router.post("/", (req, res) => {
  const {
    body: { queryResult: { intent: { displayName } = {} } = {} },
  } = req;
  switch (displayName) {
    case "movie-intent":
      moviesRes(req, res);
      break;
    case "transferIntent":
      transferRes(req, res);
      break;

    default:
      break;
  }
});

module.exports = router;

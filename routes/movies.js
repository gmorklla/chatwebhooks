const express = require("express");
const router = express.Router();
const http = require("http");
const { WebhookClient } = require("dialogflow-fulfillment");
const MOVIE_API_KEY = require("./apiKey");

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
  const movieToSearch =
    req.body.queryResult &&
    req.body.queryResult.parameters &&
    req.body.queryResult.parameters["movie-name"]
      ? req.body.queryResult.parameters["movie-name"]
      : "The Godfather";
  const reqUrl = encodeURI(
    `http://www.omdbapi.com/?t=${movieToSearch}&apikey=${MOVIE_API_KEY}`
  );
  http.get(
    reqUrl,
    (responseFromAPI) => {
      let completeResponse = "";
      responseFromAPI.on("data", (chunk) => {
        completeResponse += chunk;
      });
      responseFromAPI.on("end", () => {
        const movie = JSON.parse(completeResponse);
        let dataToSend =
          movieToSearch === "The Godfather"
            ? `I don't have the required info on that. Here's some info on 'The Godfather' instead.\n`
            : "";
        dataToSend += `${movie.Title} is a ${movie.Actors} starer ${movie.Genre} movie, released in ${movie.Year}. It was directed by ${movie.Director}`;
        const agent = new WebhookClient({ request: req, response: res });
        function movieData(agent) {
          agent.add(dataToSend);
        }
        let intentMap = new Map();
        intentMap.set("movie-intent", movieData);
        agent.handleRequest(intentMap);
      });
    },
    (error) => {
      return res.json({
        speech: "Something went wrong!",
        displayText: "Something went wrong!",
        source: "get-movie-details",
      });
    }
  );
});

module.exports = router;

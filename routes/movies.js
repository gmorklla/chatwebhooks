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
  const {
    body: { queryResult: { parameters = {} } = {} },
  } = req;
  const movieToSearch = parameters["movie-name"] || "The Godfather";
  const urlAPI = encodeURI(
    `http://www.omdbapi.com/?t=${movieToSearch}&apikey=${MOVIE_API_KEY}`
  );
  http.get(
    urlAPI,
    (resAPI) => {
      let completeResponse = "";
      resAPI.on("data", (chunk) => {
        completeResponse += chunk;
      });
      resAPI.on("end", () => endCallback(req, res, completeResponse, movieToSearch));
    },
    (error) => {
      return res.json({
        speech: "¡Algo salió mal!",
        displayText: "¡Algo salió mal!",
        source: "get-movie-details",
      });
    }
  );
});

function endCallback(req, res, completeResponse, movieToSearch) {
  const movie = JSON.parse(completeResponse);
  let dataToSend =
    movieToSearch === "The Godfather"
      ? `No tengo la información al respecto, pero aquí tienes algunos datos sobre 'The Godfather'.\n`
      : "";
  dataToSend += `${movie.Title} es una película de ${movie.Genre} protagonizada por ${movie.Actors}, estrenada en ${movie.Year} y dirigida por ${movie.Director}.`;
  const agent = new WebhookClient({ request: req, response: res });
  function movieData(agent) {
    agent.add(dataToSend);
  }
  let intentMap = new Map();
  intentMap.set("movie-intent", movieData);
  agent.handleRequest(intentMap);
}

module.exports = router;

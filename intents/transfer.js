const { WebhookClient, Card } = require("dialogflow-fulfillment");

const intentMap = new Map();
intentMap.set("transferIntent", transferData);

function transferData(agent) {
  const card = new Card({
    title: "card title",
    text: "card text",
    imageUrl:
      "https://b00c-2806-2f0-9181-e855-69b4-4d68-e16-5638.ngrok-free.app/images/app-development.jpg",
    buttonText: "This is a button",
    buttonUrl: "https://assistant.google.com/"
  });
  const card2 = new Card({
    title: "card title 2",
    text: "card text 2",
    imageUrl:
      "https://b00c-2806-2f0-9181-e855-69b4-4d68-e16-5638.ngrok-free.app/images/app-development.jpg",
    buttonText: "This is a button 2",
    buttonUrl: "https://assistant.google.com/"
  });
  agent.add([card, card2]);
}

const errorIntentMap = new Map();
errorIntentMap.set("transferIntent", errorData);

function errorData(agent) {
  const dataToSend = "Error!!!";
  agent.add(dataToSend);
}

function response(req, res) {
  const agent = new WebhookClient({ request: req, response: res });
  try {
    agent.handleRequest(intentMap);
  } catch (error) {
    console.log("ERROR", error);
    agent.handleRequest(errorIntentMap);
  }
}

module.exports = response;

const { WebhookClient } = require("dialogflow-fulfillment");

function response(req, res) {
  const dataToSend = 'Transfer intent response from Node JS';
  const agent = new WebhookClient({ request: req, response: res });
  function transferData(agent) {
    agent.add(dataToSend);
  }
  let intentMap = new Map();
  intentMap.set("transferIntent", transferData);
  agent.handleRequest(intentMap);
}

module.exports = response;

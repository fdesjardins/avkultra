const secrets = require('./secrets.json')

module.exports = {
  api: {
    host: 'http://104.197.102.53:34110'
  },
  fxml: {
    host: `http://fdesjardins:${secrets.fxml.apiKey}@flightxml.flightaware.com/json/FlightXML2`,
    username: secrets.fxml.username,
    apiKey: secrets.fxml.apiKey
  },
  bingMapsApiKey: secrets.bingMapsApiKey
}

const secrets = require('./secrets.json')

module.exports = {
  api: {
    host: 'http://104.197.102.53:34110'
  },
  fxml: {
    host: 'http://flightxml.flightaware.com/json/FlightXML2/'
  },
  bingMapsApiKey: secrets.bingMapsApiKey
}

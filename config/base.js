const _ = require('lodash')

const secrets = require('./secrets.json')

const config = {}

config.environments = Object.freeze({
  local: 'local',
  production: 'production'
})

config.environment = config.environments[process.env.NODE_ENV || 'local']

module.exports = _.merge({}, config, {
  fxml: {
    host: `http://fdesjardins:${secrets.fxml.apiKey}@flightxml.flightaware.com/json/FlightXML2`,
    username: secrets.fxml.username,
    apiKey: secrets.fxml.apiKey
  },
  bingMapsApiKey: secrets.bingMapsApiKey
})

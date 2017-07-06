
const fs = require('fs')
const path = require('path')
const express = require('express')
const superagent = require('superagent')
const cors = require('cors')
const catbox = require('catbox')
const catboxRedis = require('catbox-redis')
const compression = require('compression')

const config = require('../config')
const cache = require('./middleware/caching')

const flightAwareFetch = aircraftId => {
  return superagent.get(`http://flightxml.flightaware.com/json/FlightXML2/InFlightInfo?callback=superagentCallback149912344198695&ident=${aircraftId}`)
    .auth(config.fxml.username, config.fxml.apiKey)
    .then(response => response.text)
    .catch(err => console.error(err))
}

module.exports = async (config) => {
  const app = express()
  app.use(express.static(path.join(__dirname, '../dist')))

  app.use(cors())
  app.all('*', cors())

  app.use(compression())

  const client = new catbox.Client(catboxRedis, {
    partition: `avku`,
    host: '127.0.0.1',
    port: 6379,
    password: ''
  })
  client.start(() => {})
  app.set('cache', client)

  app.get('/:aircraftId', cache(90), (req, res, next) => {
    flightAwareFetch(req.params.aircraftId)
      .then(results => res.send(JSON.parse(results).InFlightInfoResult))
      .catch(err => console.error(err))
  })

  const server = app.listen(1358)
  console.log('listening on 1358...')

  return { app, server }
}

if (!module.parent) {
  module.exports({})
}


const fs = require('fs')
const path = require('path')
const express = require('express')
const superagent = require('superagent')
const cors = require('cors')
const catbox = require('catbox')
const catboxRedis = require('catbox-redis')
const compression = require('compression')
const bodyParser = require('body-parser')

const config = require('../config')
const cache = require('./middleware/caching')

const flightAwareFetch = aircraftId => {
  return superagent.get(`http://flightxml.flightaware.com/json/FlightXML2/InFlightInfo?callback=superagentCallback149912344198695&ident=${aircraftId}`)
    .auth(config.fxml.username, config.fxml.apiKey)
    .then(response => response.text)
    .catch(err => console.error(err))
}

const getInFlightInfo = (client, aircraftId) => {
  const key = {
    segment: 'avku',
    id: aircraftId
  }

  return new Promise((resolve, reject) => {
    client.get(key, (err, cached) => {
      if (err) {
        return reject(err)
      }
      if (cached) {
        console.log('cached', cached.item.faFlightID)
        return resolve(cached.item)
      }
      console.log('doing fetch')
      flightAwareFetch(aircraftId)
        .then(results => {
          const infoResult = JSON.parse(results).InFlightInfoResult
          client.set(key, infoResult, 30 * 60 * 1000, reject)
          resolve(infoResult)
        })
        .catch(reject)
    })
  })
}

module.exports = async (config) => {
  const app = express()
  app.use(express.static(path.join(__dirname, '../dist')))

  app.use(cors())
  app.all('*', cors())

  app.use(compression())
  app.use(bodyParser.json())

  const client = new catbox.Client(catboxRedis, {
    partition: `avku`,
    host: '127.0.0.1',
    port: 6379,
    password: ''
  })
  client.start(() => {})
  app.set('cache', client)

  app.get('/:aircraftId', cache(60), (req, res, next) => {
    flightAwareFetch(req.params.aircraftId)
      .then(results => res.send(JSON.parse(results).InFlightInfoResult))
      .catch(err => console.error(err))
  })

  app.post('/aircraft', cache(60), (req, res, next) => {
    const aircraft = req.body.aircraft.slice(0, 20)
    Promise.all(aircraft.map(aircraftId => getInFlightInfo(client, aircraftId)))
      .then(responses => {
        res.json(responses)
      })
  })

  const server = app.listen(1358)
  console.log('listening on 1358...')

  return { app, server }
}

if (!module.parent) {
  module.exports({})
}

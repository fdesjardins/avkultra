const fs = require('fs')
const path = require('path')
const express = require('express')
const livereload = require('livereload')
const compression = require('compression')
const cors = require('cors')
const catbox = require('catbox')
const catboxRedis = require('catbox-redis')

const cache = require('../proxy/middleware/caching')
const notams = require('./notams')

module.exports = async (config) => {
  const app = express()
  app.use(compression())
  app.use(express.static(path.join(__dirname, '../dist')))

  app.use(cors())
  app.all('*', cors())

  const client = new catbox.Client(catboxRedis, {
    partition: `avku`,
    host: process.env.REDIS_HOST || 'localhost',
    port: 6379,
    password: ''
  })
  client.start(() => {})
  app.set('cache', client)

  const layout = (await fs.readFileSync(path.join(__dirname, 'layout.html'))).toString()
  app.get('/', (req, res, next) => {
    res.send(layout)
  })

  app.get('/notams', cache(5), (req, res, next) => {
    notams([
      'KZLC',
      'KZOA',
      'KZAB',
      'KZDV',
      'KZSE',
      'KZDC',
      'KHZU',
      'KZMA',
      'PANC'
    ]).then(results => res.json(results))
  })

  const server = app.listen(1357)
  console.log('listening on 1357...')

  const livereloadServer = livereload.createServer({
    delay: 100
  })
  livereloadServer.watch(path.join(__dirname, '../dist'))

  return { app, server }
}

if (!module.parent) {
  module.exports({})
}

const fs = require('fs')
const path = require('path')
const express = require('express')
const livereload = require('livereload')

module.exports = async (config) => {
  const app = express()
  app.use(express.static(path.join(__dirname, '../dist')))

  const layout = (await fs.readFileSync(path.join(__dirname, 'layout.html'))).toString()
  app.get('/', (req, res, next) => {
    res.send(layout)
  })

  const server = app.listen(1357)
  console.log('listening on 1357...')

  const livereloadServer = livereload.createServer({
    delay: 0
  })
  livereloadServer.watch(path.join(__dirname, '../dist'))

  return { app, server }
}

if (!module.parent) {
  module.exports({})
}

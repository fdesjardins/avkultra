const _ = require('lodash')

const baseConfig = require('./base')

exports.local = _.merge({}, baseConfig, {
  api: {
    host: 'http://104.198.183.44/v2'
  },
  avkuApi: {
    host: 'http://localhost:1357'
  },
  proxyApi: {
    host: 'http://localhost:1358'
  }
})

exports.production = _.merge({}, baseConfig, {
  api: {
    host: 'http://104.198.183.44/v2'
  },
  avkuApi: {
    host: 'http://138.68.50.91:1357'
  },
  proxyApi: {
    host: 'http://138.68.50.91:1358'
  }
})

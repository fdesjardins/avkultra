const _ = require('lodash')

const baseConfig = require('./base')

exports.development = _.merge({}, baseConfig, {
  api: {
    host: 'http://localhost:34100'
  },
  avkuApi: {
    host: process.env.API_URI
  },
  proxyApi: {
    host: process.env.PROXY_API_URI
  }
})

exports.production = _.merge({}, baseConfig, {
  api: {
    host: 'http://192.168.0.112:34100'
  },
  avkuApi: {
    host: process.env.API_URI
  },
  proxyApi: {
    host: process.env.PROXY_API_URI
  }
})

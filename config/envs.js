const _ = require('lodash')

const baseConfig = require('./base')

exports.development = _.merge({}, baseConfig, {
  api: {
    host: 'https://avcamsapi.faa.gov'
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
    host: 'https://avcamsapi.faa.gov'
  },
  avkuApi: {
    host: process.env.API_URI
  },
  proxyApi: {
    host: process.env.PROXY_API_URI
  }
})

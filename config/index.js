const environment = require('./base').environment

module.exports = require(`./envs`)[environment]

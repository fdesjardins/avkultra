const environment = require('./base').environment

console.log('env', environment)

module.exports = require(`./envs`)[environment]

import superagent from 'superagent'
import jsonp from 'superagent-jsonp'
import url from 'url'
import config from '-/config'

exports.shouldUpdate = (lastProps, nextProps) => {
  return JSON.stringify(lastProps) !== JSON.stringify(nextProps)
}

exports.apiFetch = route => {
  return superagent.get(url.resolve(config.api.host, route))
    .then(results => results.body.payload)
    .catch(err => console.error(err))
}

exports.flightAwareFetch = aircraftId => {
  return superagent.get(`http://138.68.50.91:1358/${aircraftId}`)
    .then(response => response.body)
    .catch(err => console.error(err))
}

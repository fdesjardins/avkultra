import superagent from 'superagent'
import jsonp from 'superagent-jsonp'
import url from 'url'
import config from '-/config'

exports.shouldUpdate = (lastProps, nextProps) => {
  return JSON.stringify(lastProps) !== JSON.stringify(nextProps)
}

exports.apiFetch = route => {
  return superagent.get(`${config.api.host}${route}`)
    .then(results => results.body.payload)
    .catch(err => console.error(err))
}

exports.flightAwareFetch = aircraftId => {
  return superagent.get(`${config.proxyApi.host}/${aircraftId}`)
    .then(response => response.body)
    .catch(err => console.error(err))
}

exports.notamsFetch = () => {
  return superagent.get(`${config.avkuApi.host}/notams`)
    .then(response => response.body)
    .catch(err => console.error(err))
}

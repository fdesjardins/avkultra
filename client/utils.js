import superagent from 'superagent'
import jsonp from 'superagent-jsonp'
import url from 'url'
import config from '../config'

console.log('config', config)

export const shouldUpdate = (lastProps, nextProps) => {
  return JSON.stringify(lastProps) !== JSON.stringify(nextProps)
}

export const apiFetch = route => {
  return superagent.get(`${config.api.host}${route}`)
    .then(results => results.body.payload)
    .catch(err => console.error(err))
}

export const flightAwareFetch = aircraftIds => {
  return superagent.post(`${config.proxyApi.host}/aircraft`)
    .set('Content-Type', 'application/json')
    .send({ aircraft: aircraftIds })
    .then(response => response.body)
    .catch(err => console.error(err))
}

export const notamsFetch = () => {
  return superagent.get(`${config.avkuApi.host}/notams`)
    .then(response => response.body)
    .catch(err => console.error(err))
}

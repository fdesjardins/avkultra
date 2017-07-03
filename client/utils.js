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

exports.flightAwareFetch = route => {
  return superagent.get(url.resolve(config.fxml.host, route))
    .use(jsonp)
    .catch(err => console.error(err))
}

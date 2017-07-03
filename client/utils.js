import superagent from 'superagent'
import url from 'url'

exports.shouldUpdate = (lastProps, nextProps) => {
  return JSON.stringify(lastProps) !== JSON.stringify(nextProps)
}

exports.apiFetch = route => {
  return superagent.get(url.resolve('http://localhost:34100/', route))
    .then(results => results.body.payload)
    .catch(err => console.error(err))
}

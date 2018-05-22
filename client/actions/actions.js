import state from '../state'
import { apiFetch, flightAwareFetch, notamsFetch } from '-/utils'

const incrementCount = countCursor => (amount = 1) => () => {
  countCursor.set(countCursor.get() + amount)
}

const buildRequests = route => _.range(13).map(i => `${route}?bounds=0,-${i * 15}|90,${-1 * (i * 15 - 15)}`)

const fetchOnGrid = route => {
  const requests = buildRequests(`${route}`)
  return Promise.all(requests.map(r => apiFetch(r)))
    .then(results => [].concat(...results))
}

const extractAirports = locations => {
  if (locations && locations.length > 0) {
    return _.flatten(locations.map(a => {
      if (a && a.data && a.data.length > 0) {
        let visibility = 1
        if (a.display && a.display.length > 0) {
          const lowest = a.display.find(d => d.markerStyle === 'FULL')
          if (lowest && lowest.level) {
            visibility = 13 - lowest.level
          }
        }
        return a.data.map(d => {
          if (d.type === 'airport') {
            return _.merge({}, d, { visibility: Math.pow(visibility, 3.5) })
          }
        })
      }
    })).filter(x => !!x)
  }
}

const getAirports = async () => {
  const response = await fetchOnGrid('/locations')

  state.set(['globe', 'airports'], extractAirports(response))

  console.log(state.get(['globe', 'airports']))
}

const registerViewer = (viewer) => {
  state.set(['globe', 'viewer'], viewer)
}

export {
  getAirports,
  registerViewer
}
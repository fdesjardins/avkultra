import Baobab from 'baobab'
import superagent from 'superagent'
import _ from 'lodash'
import Promise from 'bluebird'

import { apiFetch, flightAwareFetch, notamsFetch } from '-/utils'

const state = new Baobab({
  meta: {
    name: 'avkultra'
  },
  globe: {
    airports: [],
    aircraftReports: [],
    aireps: [],
    stations: [],
    sites: [],
    navaids: [],
    notams: [],
    aircraft: []
  }
})

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

const initAirports = () => fetchOnGrid('/locations')
  .then(extractAirports)
  .then(airports => state.select('globe', 'airports').set(airports))

const initPireps = () => fetchOnGrid('/aircraft-reports/pireps')
  .then(pireps => state.select('globe', 'aircraftReports').set(pireps))

const initAireps = () => fetchOnGrid('/aircraft-reports/aireps')
  .then(aireps => state.select('globe', 'aireps').set(aireps))

const initAircraft = () => {
  const aireps = state.select('globe', 'aireps').get()
  return Promise.resolve(_.uniqBy(aireps, a => a.aircraftRef))
    .map(airep => airep.aircraftRef)
    .then(aircraftRefs => {
      return flightAwareFetch(aircraftRefs)
        .then(aircraftInfo => {
          // console.log(aircraftInfo)
          state.select('globe', 'aircraft').set(aircraftInfo)
        })
    })
}

const initStations = () => fetchOnGrid('/stations')
  .then(stations => state.select('globe', 'stations').set(stations))

const initSites = () => fetchOnGrid('/sites')
  .then(sites => state.select('globe', 'sites').set(sites))

// const initNotams = () => apiFetch('/navaids')
//   .then(navaids => state.select('globe', 'navaids').set(navaids))

const initNotams = () => notamsFetch('kzdv')
  .then(notams => state.select('globe', 'notams').set(notams))

// https://stackoverflow.com/a/19356304/3011062
const calculateNewPosition = (lat, long, bearing, distance) => {
  const R = 6371
  const lat2 = Math.asin(Math.sin(Math.PI / 180 * lat) * Math.cos(distance / R) + Math.cos(Math.PI / 180 * lat) * Math.sin(distance / R) * Math.cos(Math.PI / 180 * bearing))
  const lon2 = Math.PI / 180 * long + Math.atan2(Math.sin(Math.PI / 180 * bearing) * Math.sin(distance / R) * Math.cos(Math.PI / 180 * lat), Math.cos(distance / R) - Math.sin(Math.PI / 180 * lat) * Math.sin(lat2))
  return [180 / Math.PI * lat2, 180 / Math.PI * lon2]
}

const updateAircraftPositions = () => {
  const aircraftCursor = state.select('globe', 'aircraft')
  const updatedAircraft = aircraftCursor.get().map(aircraft => {
    const newPosition = calculateNewPosition(
      aircraft.lowLatitude,
      aircraft.lowLongitude,
      aircraft.heading,
      0.05
    )
    return _.merge({}, aircraft, {
      lowLongitude: newPosition[1],
      lowLatitude: newPosition[0]
    })
  })
  aircraftCursor.set(updatedAircraft)
}

const initState = () => {
  return Promise.map([
    initAirports,
    () => initAireps().then(() => initAircraft()),
    initStations,
    initNotams,
    initSites,
    initPireps
  ], x => x(), { concurrency: 2 })
    .then(() => setInterval(updateAircraftPositions, 500))
}

initState()

export default state

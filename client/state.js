import Baobab from 'baobab'
import superagent from 'superagent'
import _ from 'lodash'
import Promise from 'bluebird'

import { apiFetch, flightAwareFetch, notamsFetch } from '-/utils'
import { getAirports } from '-/actions/actions'

const tree = new Baobab({
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

const initPireps = () => fetchOnGrid('/aircraft-reports/pireps')
  .then(pireps => tree.select('globe', 'aircraftReports').set(pireps))

const initAireps = () => fetchOnGrid('/aircraft-reports/aireps')
  .then(aireps => tree.select('globe', 'aireps').set(aireps))

const initAircraft = () => {
  const aireps = tree.select('globe', 'aireps').get()
  return Promise.resolve(_.uniqBy(aireps, a => a.aircraftRef))
    .map(airep => airep.aircraftRef)
    .then(aircraftRefs => {
      return flightAwareFetch(aircraftRefs)
        .then(aircraftInfo => {
          // console.log(aircraftInfo)
          tree.select('globe', 'aircraft').set(aircraftInfo)
        })
    })
}

const initStations = () => fetchOnGrid('/stations')
  .then(stations => tree.select('globe', 'stations').set(stations))

const initSites = () => fetchOnGrid('/sites')
  .then(sites => tree.select('globe', 'sites').set(sites))

// const initNotams = () => apiFetch('/navaids')
//   .then(navaids => state.select('globe', 'navaids').set(navaids))

const initNotams = () => notamsFetch('kzdv')
  .then(notams => tree.select('globe', 'notams').set(notams))

// https://stackoverflow.com/a/19356304/3011062
const calculateNewPosition = (lat, long, bearing, distance) => {
  const R = 6371
  const lat2 = Math.asin(Math.sin(Math.PI / 180 * lat) * Math.cos(distance / R) + Math.cos(Math.PI / 180 * lat) * Math.sin(distance / R) * Math.cos(Math.PI / 180 * bearing))
  const lon2 = Math.PI / 180 * long + Math.atan2(Math.sin(Math.PI / 180 * bearing) * Math.sin(distance / R) * Math.cos(Math.PI / 180 * lat), Math.cos(distance / R) - Math.sin(Math.PI / 180 * lat) * Math.sin(lat2))
  return [180 / Math.PI * lat2, 180 / Math.PI * lon2]
}

const updateAircraftPositions = () => {
  const aircraftCursor = tree.select('globe', 'aircraft')
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
  getAirports()

    // () => initAireps().then(() => initAircraft()),
    // initStations,
    // initNotams,
    // initSites,
    // initPireps
  // ], x => x(), { concurrency: 2 })
    // .then(() => setInterval(updateAircraftPositions, 500))
}

// initState()

export default tree

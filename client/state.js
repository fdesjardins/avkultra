import Baobab from 'baobab'
import superagent from 'superagent'
import _ from 'lodash'

import { incrementCount } from '-/actions/actions'
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

const locationRequests = _.range(13).map(i => `/locations?bounds=0,-${i * 15}|90,-${i * 15 - 15}`)
Promise.all(locationRequests.map(lr => apiFetch(lr)))
  .then(results => [].concat(...results))
  .then(locations => {
    // console.log(locations)
    if (locations && locations.length > 0) {
      return _.flatten(locations.map(a => {
        if (a && a.data && a.data.length > 0) {
          let visibility = 1
          if (a.display && a.display.length > 0) {
            // console.log(a.display)
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
  })
  .then(airports => {
    state.select('globe', 'airports').set(airports)
  })

apiFetch('/aircraft-reports/pireps')
  .then(pireps => state.select('globe', 'aircraftReports').set(pireps))

apiFetch('/aircraft-reports/aireps?bounds=0,-180|90,1')
  .then(aireps => _.uniqBy(aireps, a => a.aircraftRef))
  .then(aireps => {
    state.select('globe', 'aireps').set(aireps)
    aireps.map(airep => {
      flightAwareFetch(airep.aircraftRef)
        .then(aircraftInfo => {
          state.select('globe', 'aircraft').push(aircraftInfo)
        })
    })
  })

apiFetch('/stations?bounds=0,-180|90,1')
  .then(stations => state.select('globe', 'stations').set(stations))

apiFetch('/sites')
  .then(sites => state.select('globe', 'sites').set(sites))

// apiFetch('/navaids')
//   .then(navaids => state.select('globe', 'navaids').set(navaids))

notamsFetch('kzdv')
  .then(notams => state.select('globe', 'notams').set(notams))

const calculateNewPosition = (lat, long, bearing, distance) => {
  const R = 6371
  var lat2 = Math.asin(Math.sin(Math.PI / 180 * lat) * Math.cos(distance / R) + Math.cos(Math.PI / 180 * lat) * Math.sin(distance / R) * Math.cos(Math.PI / 180 * bearing))
  var lon2 = Math.PI / 180 * long + Math.atan2(Math.sin(Math.PI / 180 * bearing) * Math.sin(distance / R) * Math.cos(Math.PI / 180 * lat), Math.cos(distance / R) - Math.sin(Math.PI / 180 * lat) * Math.sin(lat2))
  return [180 / Math.PI * lat2, 180 / Math.PI * lon2]
}

setInterval(() => {
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
}, 500)

export default state

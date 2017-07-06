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

apiFetch('/airports')
  .then(airports => state.select('globe', 'airports').set(airports))

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

apiFetch('/navaids')
  .then(navaids => state.select('globe', 'navaids').set(navaids))

notamsFetch('kzdv')
  .then(notams => state.select('globe', 'notams').set(notams))

export default state

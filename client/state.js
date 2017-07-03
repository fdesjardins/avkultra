import Baobab from 'baobab'
import superagent from 'superagent'

import { incrementCount } from '-/actions/actions'
import { apiFetch, flightAwareFetch } from '-/utils'

const state = new Baobab({
  meta: {
    name: 'avkultra'
  },
  globe: {
    airports: [],
    aircraftReports: [],
    stations: [],
    sites: [],
    navaids: [],
    notams: [],
    planes: []
  }
})

apiFetch('/airports')
  .then(airports => state.select('globe', 'airports').set(airports))

apiFetch('/aircraft-reports/pireps')
  .then(pireps => state.select('globe', 'aircraftReports').set(pireps))

apiFetch('/stations?bounds=0,-180|90,1')
  .then(stations => state.select('globe', 'stations').set(stations))

apiFetch('/sites')
  .then(sites => state.select('globe', 'sites').set(sites))

apiFetch('/navaids')
  .then(navaids => state.select('globe', 'navaids').set(navaids))

apiFetch('/notams')
  .then(notams => state.select('globe', 'notams').set(notams))

flightAwareFetch('/Metars', { airport: 'LAX' })
  .then(metars => {
    console.log(metars)
  })

export default state

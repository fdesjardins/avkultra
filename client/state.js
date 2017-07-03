import Baobab from 'baobab'
import superagent from 'superagent'

import { incrementCount } from '-/actions/actions'

const state = new Baobab({
  meta: {
    name: 'avkultra'
  },
  globe: {
    airports: [],
    aircraftReports: [],
    stations: [],
    sites: []
  }
})

superagent.get('http://104.197.102.53:34110/airports')
  .then(results => results.body.payload)
  .then(airports => {
    state.select('globe', 'airports').set(airports)
  })
  .catch(err => console.error(err))

superagent.get('http://104.197.102.53:34110/aircraft-reports/pireps')
  .then(results => results.body.payload)
  .then(aircraftReports => {
    state.select('globe', 'aircraftReports').set(aircraftReports)
  })
  .catch(err => console.error(err))

superagent.get('http://104.197.102.53:34110/stations?bounds=0,-180|90,1')
  .then(results => results.body.payload)
  .then(stations => {
    state.select('globe', 'stations').set(stations)
  })
  .catch(err => console.error(err))

superagent.get('http://104.197.102.53:34110/sites')
  .then(results => results.body.payload)
  .then(sites => {
    state.select('globe', 'sites').set(sites)
  })
  .catch(err => console.error(err))

export default state

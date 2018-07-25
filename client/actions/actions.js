import { apiFetch, flightAwareFetch, notamsFetch } from '-/utils'

import state from '../state'

const incrementCount = countCursor => (amount = 1) => () => {
  countCursor.set(countCursor.get() + amount)
}

const buildRequests = route =>
  _.range(13).map(i => `${route}?bounds=0,-${i * 15}|90,${-1 * (i * 15 - 15)}`)

const fetchOnGrid = route => {
  const requests = buildRequests(`${route}`)
  return Promise.all(requests.map(r => apiFetch(r))).then(results =>
    [].concat(...results)
  )
}

// const extractAirports = locations => {
//   if (locations && locations.length > 0) {
//     return _.flatten(
//       locations.map(a => {
//         if (a && a.data && a.data.length > 0) {
//           let visibility = 1
//           if (a.display && a.display.length > 0) {
//             const lowest = a.display.find(d => d.markerStyle === 'FULL')
//             if (lowest && lowest.level) {
//               visibility = 13 - lowest.level
//             }
//           }
//           return a.data.map(d => {
//             if (d.type === 'airport') {
//               return _.merge({}, d, { visibility: Math.pow(visibility, 3.5) })
//             }
//           })
//         }
//       })
//     ).filter(x => !!x)
//   }
// }

const extractVisibility = location => {
  let visibility = 1
  if (location.display && location.display.length > 0) {
    const lowest = location.display.find(d => d.markerStyle === 'FULL')
    if (lowest && lowest.level) {
      visibility = 13 - lowest.level
    }
  }
  return Math.pow(visibility, 3.5)
}

const getLocations = async () => {
  const locations = state.get('locations')
  if (locations) {
    return locations
  }
  console.log('Fetching locations')
  console.time('fetch')
  state.set('locations', [])
  const response = await fetchOnGrid('/locations')
  if (response) {
    console.timeEnd('fetch')
    state.set('locations', response)
  }
  return response
}

const getAirports = async () => {
  const locations = await getLocations()

  const airports = []
  locations.map(location => {
    if (location && location.data) {
      location.data.map(d => {
        if (d.type === 'airport') {
          airports.push(
            Object.assign({}, d, {
              visibility: extractVisibility(location)
            })
          )
        }
      })
    }
  })

  state.set(['globe', 'airports'], airports)
}

const getSites = async () => {
  const locations = await getLocations()

  const sites = []
  locations.map(location => {
    if (location && location.data) {
      location.data.map(d => {
        if (d.type === 'cameraSite') {
          sites.push(d)
        }
      })
    }
  })

  state.set(['globe', 'sites'], sites)
}

const getAircraftReports = async () => {
  const locations = await getLocations()

  const reports = []
  locations.map(location => {
    if (location && location.data) {
      location.data.map(d => {
        if (d.type === 'aircraft_report') {
          reports.push(d)
        }
      })
    }
  })

  state.set(['globe', 'reports'], reports)
}

const registerViewer = viewer => {
  state.set(['globe', 'viewer'], viewer)
}

export { getAirports, registerViewer, getSites, getAircraftReports }

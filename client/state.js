import Baobab from 'baobab'
import _ from 'lodash'

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

// https://stackoverflow.com/a/19356304/3011062
const calculateNewPosition = (lat, long, bearing, distance) => {
  const R = 6371
  const lat2 = Math.asin(
    Math.sin(Math.PI / 180 * lat) * Math.cos(distance / R) +
      Math.cos(Math.PI / 180 * lat) *
        Math.sin(distance / R) *
        Math.cos(Math.PI / 180 * bearing)
  )
  const lon2 =
    Math.PI / 180 * long +
    Math.atan2(
      Math.sin(Math.PI / 180 * bearing) *
        Math.sin(distance / R) *
        Math.cos(Math.PI / 180 * lat),
      Math.cos(distance / R) - Math.sin(Math.PI / 180 * lat) * Math.sin(lat2)
    )
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

export default tree

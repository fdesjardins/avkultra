const notams = require('notams')
const Promise = require('bluebird')

const extractRadius = text => {
  const radiusNm = text.match(/[0-9]*( )?NM/g)
  return radiusNm
    ? parseFloat(radiusNm[0].replace(/NM/g, '').trim())
    : null
}

const extractCenter = text => {
  const center = text.match(/[0-9]*N(\/)?[0-9]*W/g)
  if (center) {
    let north, west
    if (center[0].match(/[0-9]*N(\/)[0-9]*W/g)) {
      splitCenter = center[0].split(/\//)
      north = splitCenter[0].replace('N', '')
      west = splitCenter[1].replace('W', '')
    }
    if (center[0].match(/[0-9]*N[0-9]*W/g)) {
      north = center[0].match(/[0-9]*N/g)[0].replace('N', '')
      west = center[0].match(/[0-9]*W/g)[0].replace('W', '')
    }

    let latitude, longitude
    if (north.length === 7) {
      latitude = parseFloat(`${north.slice(0, 3)}.${north.slice(3, north.length)}`)
    }
    if (north.length === 6) {
      latitude = parseFloat(`${north.slice(0, 2)}.${north.slice(2, north.length)}`)
    }
    if (west.length === 7) {
      longitude = -1 * parseFloat(`${west.slice(0, 3)}.${west.slice(3, west.length)}`)
    }
    if (west.length === 6) {
      longitude = -1 * parseFloat(`${west.slice(0, 2)}.${west.slice(2, west.length)}`)
    }

    return {
      latitude,
      longitude
    }
  }
  return null
}

const extractFlightLevelBottomFt = text => {
  const heightFt = text.match(/SFC-[0-9]*FT/g)
  if (heightFt) {
    return 0
  }
  return null
}

const extractHeightFt = text => {
  let heightFt = text.match(/SFC-[0-9]*FT/g)
  if (heightFt) {
    return parseFloat(heightFt[0].replace('SFC-', '').replace('FT', ''))
  }
  heightFt = text.match(/[0-9]*FT/g)
  if (heightFt) {
    return parseFloat(heightFt[0].replace('FT', ''))
  }
  return null
}

const extractVolumes = rawNotamText => {
  const notam = rawNotamText.replace(/\r?\n|\r/g, ' ').trim()

  if (notam.match(/AREA DEFINED AS/g)) {
    const volume = {
      radiusNm: null,
      center: null,
      flightLevelBottomFt: null,
      heightFt: null
    }
    const locationBeginStr = 'AREA DEFINED AS'
    const locationBegin = notam.indexOf(locationBeginStr)
    let rest = notam.slice(locationBegin + locationBeginStr.length, notam.length)

    volume.radiusNm = extractRadius(rest)
    volume.center = extractCenter(rest)
    volume.flightLevelBottomFt = extractFlightLevelBottomFt(rest)
    volume.heightFt = extractHeightFt(rest)

    return volume
  }

  return null
}

module.exports = icaos => {
  return Promise.resolve(notams.fetch(icaos, { format: 'DOMESTIC' }))
    .then(results => {
      return [].concat(...results.map(r => r.notams))
    })
    .map(notam => {
      return {
        rawText: notam,
        volumes: extractVolumes(notam) || null
      }
    })
}

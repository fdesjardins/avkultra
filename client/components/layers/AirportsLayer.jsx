import Cartesian2 from 'cesium/Core/Cartesian2'
import Cartesian3 from 'cesium/Core/Cartesian3'
import Color from 'cesium/Core/Color'
import HeightReference from 'cesium/Scene/HeightReference'
import LabelGraphics from 'cesium/DataSources/LabelGraphics'
import NearFarScalar from 'cesium/Core/NearFarScalar'
import React from 'react'
import { branch } from 'baobab-react/higher-order'
import css2json from 'css2json'
import { getAirports } from '../../actions/actions'
import jsonMarkup from 'json-markup'

const jsonCss = css2json(`
  .json-markup {
  	line-height: 17px;
  	font-size: 13px;
  	font-family: monospace;
  	white-space: pre;
  }
  .json-markup-key {
  	font-weight: bold;
  }
  .json-markup-bool {
  	color: firebrick;
  }
  .json-markup-string {
  	color: green;
  }
  .json-markup-null {
  	color: gray;
  }
  .json-markup-number {
  	color: blue;
  }
`)

const AirportsLayer = branch(
  { airports: ['globe', 'airports'] },
  ({ viewer, airports }) => {
    if (!airports || airports.length === 0) {
      getAirports()
      return false
    }
    airports.map(airport => {
      viewer.entities.add({
        name: `${airport.icaoAirportName} (${airport.icaoIdentifier}) Airport`,
        description: jsonMarkup(airport, jsonCss),
        label: new LabelGraphics({
          text: airport.icao,
          font: '12px Arial',
          fillColor: Color.WHITE,
          pixelOffset: new Cartesian2(22, 15),
          translucencyByDistance: new NearFarScalar(
            airport.visibility * 4.3e4,
            1.0,
            airport.visibility * 4.6e4,
            0.0
          )
        }),
        position: Cartesian3.fromDegrees(
          parseFloat(airport.longitude),
          parseFloat(airport.latitude)
        ),
        point: {
          color: Color.TRANSPARENT,
          outlineColor: Color.WHITE,
          outlineWidth: 1.5,
          pixelSize: 12,
          shadows: true,
          heightReference: HeightReference.CLAMP_TO_GROUND,
          translucencyByDistance: new NearFarScalar(
            airport.visibility * 4.3e4,
            1.0,
            airport.visibility * 4.6e4,
            0.0
          )
        }
      })
    })
    return <div className="airports-layer" />
  }
)

export default AirportsLayer

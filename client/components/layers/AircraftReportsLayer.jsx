import Cartesian2 from 'cesium/Core/Cartesian2'
import Cartesian3 from 'cesium/Core/Cartesian3'
import Color from 'cesium/Core/Color'
import HeightReference from 'cesium/Scene/HeightReference'
import LabelGraphics from 'cesium/DataSources/LabelGraphics'
import NearFarScalar from 'cesium/Core/NearFarScalar'
import React from 'react'
import { branch } from 'baobab-react/higher-order'
import css2json from 'css2json'
import { getAircraftReports } from '../../actions/actions'
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

const mapPirepIntensityToColor = intensity => {
  if (intensity > 7) {
    return Color.RED
  }
  if (intensity > 5) {
    return Color.ORANGE
  }
  if (intensity > 1) {
    return Color.GREEN
  }
  return Color.BLUE
}

const AircraftReportsLayer = branch(
  { reports: ['globe', 'reports'] },
  ({ viewer, reports }) => {
    if (!reports || reports.length === 0) {
      getAircraftReports()
      return false
    }
    reports.map(report => {
      viewer.entities.add({
        name: `${report.siteName} Camera Site`,
        description: jsonMarkup(report, jsonCss),
        label: new LabelGraphics({
          text: report.siteName,
          font: '12px Arial',
          fillColor: Color.WHITE,
          pixelOffset: new Cartesian2(22, 15),
          translucencyByDistance: new NearFarScalar(
            report.visibility * 4.3e4,
            1.0,
            report.visibility * 4.6e4,
            0.0
          )
        }),
        position: Cartesian3.fromDegrees(
          parseFloat(report.longitude),
          parseFloat(report.latitude)
        ),
        box: {
          dimensions: new Cartesian3(15000.0, 15000.0, 7500.0),
          material: mapPirepIntensityToColor(report.parsed.severity).withAlpha(
            0.5
          ),
          outline: true,
          outlineColor: Color.WHITE,
          outlineWidth: 2
        }
      })
    })
    return <div className="aircraft-reports-layer" />
  }
)

export default AircraftReportsLayer

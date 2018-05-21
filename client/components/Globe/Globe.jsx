import React from 'react'
import { branch } from 'baobab-react/higher-order'

import cesium from "cesium/Cesium"

import jsonMarkup from 'json-markup'
import css2json from 'css2json'

import Cartesian2 from 'cesium/Core/Cartesian2'
import Cartesian3 from 'cesium/Core/Cartesian3'
import Color from 'cesium/Core/Color'
import Transforms from 'cesium/Core/Transforms'
import Quaternion from 'cesium/Core/Quaternion'
import HeadingPitchRoll from 'cesium/Core/HeadingPitchRoll'
import NearFarScalar from 'cesium/Core/NearFarScalar'
import BingMapsApi from 'cesium/Core/BingMapsApi'
import CesiumTerrainProvider from 'cesium/Core/CesiumTerrainProvider'

import LabelGraphics from 'cesium/DataSources/LabelGraphics'
import BillboardGraphics from 'cesium/DataSources/BillboardGraphics'
import RectangleGraphics from 'cesium/DataSources/RectangleGraphics'
import ModelGraphics from 'cesium/DataSources/ModelGraphics'
import ConstantProperty from 'cesium/DataSources/ConstantProperty'

import 'cesium/Widgets/widgets.css'

import HeightReference from 'cesium/Scene/HeightReference'
import LabelStyle from 'cesium/Scene/LabelStyle'
import BingMapsImageryProvider from 'cesium/Scene/BingMapsImageryProvider'
import ArcGisMapServerImageryProvider from 'cesium/Scene/ArcGisMapServerImageryProvider'
import UrlTemplateImageryProvider from 'cesium/Scene/UrlTemplateImageryProvider'

import utils from '-/utils'
import { bingMapsApiKey } from '-/config'

import './Globe.scss'
import sr71 from '-/assets/sr71.png'
import b739 from '-/assets/B739.gltf'

let cesiumViewerOptions = {
  animation: false,
  baseLayerPicker: true,
  fullscreenButton: false,
  geocoder: false,
  homeButton: false,
  shadows: true,
  // infoBox: false,
  // sceneModePicker: false,
  // selectionIndicator: false,
  timeline: false,
  navigationHelpButton: true,
  navigationInstructionsInitiallyVisible: false,
  automaticallyTrackDataSourceClocks: false
}

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

BingMapsApi.defaultKey = 'AjQ2juL12NOTWeKSzNyYRY-fXpsH9aosgaIlbL0oVDjo2QhMLawAKqPQKui7A20K'

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

const didMount = (
  { airports }
  // aircraftReportsCursor,
  // stationsCursor,
  // sitesCursor,
  // navaidsCursor,
  // aircraftCursor,
  // airepsCursor,
  // notamsCursor
) => {
  const viewer = new cesium.Viewer('cesium-container', cesiumViewerOptions)
  // viewer.scene.imageryLayers.addImageryProvider(new UrlTemplateImageryProvider({
  //   url : 'http://104.197.62.138/map-tiles/vfr/sectional?bbox={westDegrees},{southDegrees},{eastDegrees},{northDegrees}'
  // }))
  // viewer.scene.imageryLayers.addImageryProvider(new UrlTemplateImageryProvider({
  //   url : 'http://104.197.62.138/map-tiles/vfr/terminal-area?bbox={westDegrees},{southDegrees},{eastDegrees},{northDegrees}'
  // }))
  const cesiumTerrainProviderMeshes = new CesiumTerrainProvider({
    url: '//assets.agi.com/stk-terrain/world',
    requestWaterMask: true,
    requestVertexNormals: true
  })
  viewer.terrainProvider = cesiumTerrainProviderMeshes

  console.log('airports', airports)

  if (!airports) {
    return
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
        translucencyByDistance: new NearFarScalar(airport.visibility * 4.3e4, 1.0, airport.visibility * 4.6e4, 0.0)
      }),
      position: Cartesian3.fromDegrees(parseFloat(airport.longitude), parseFloat(airport.latitude)),
      point: {
        color: Color.TRANSPARENT,
        outlineColor: Color.WHITE,
        outlineWidth: 1.5,
        pixelSize: 12,
        shadows: true,
        heightReference: HeightReference.CLAMP_TO_GROUND,
        translucencyByDistance: new NearFarScalar(airport.visibility * 4.3e4, 1.0, airport.visibility * 4.6e4, 0.0)
      }
    })
  })
}
  
  // aircraftReportsCursor.on('update', () => {
  //   aircraftReportsCursor.get().map(aircraftReport => {
  //     viewer.entities.add({
  //       description: jsonMarkup(aircraftReport, jsonCss),
  //       position: Cartesian3.fromDegrees(
  //         parseFloat(aircraftReport.longitude),
  //         parseFloat(aircraftReport.latitude),
  //         Math.max(parseFloat(aircraftReport.altitudeFtMsl - (7500 / 2)), 0) * 0.3048
  //       ),
  //       box: {
  //         dimensions: new Cartesian3(15000.0, 15000.0, 7500.0),
  //         material: mapPirepIntensityToColor(aircraftReport.parsed.severity).withAlpha(0.5),
  //         outline: true,
  //         outlineColor: Color.WHITE,
  //         outlineWidth: 2
  //       }
  //     })
  //   })
  // })
  // airepsCursor.on('update', () => {
  //   airepsCursor.get().map(airep => {
  //     viewer.entities.add({
  //       description: jsonMarkup(airep, jsonCss),
  //       position: Cartesian3.fromDegrees(
  //         parseFloat(airep.longitude),
  //         parseFloat(airep.latitude),
  //         parseFloat(airep.altitudeFtMsl - (7500 / 2)) * 0.3048
  //       ),
  //       box: {
  //         dimensions: new Cartesian3(15000.0, 15000.0, 7500.0),
  //         material: Color.WHITE.withAlpha(0.3),
  //         outline: true,
  //         outlineColor: Color.BLACK.withAlpha(0.3),
  //         outlineWidth: 2
  //       }
  //     })
  //   })
  // })
  // stationsCursor.on('update', () => {
  //   stationsCursor.get().map(station => {
  //     viewer.entities.add({
  //       name: `${station.stationName} Station`,
  //       description: jsonMarkup(station, jsonCss),
  //       position: Cartesian3.fromDegrees(parseFloat(station.longitude), parseFloat(station.latitude)),
  //       point: {
  //         color: Color.BLACK.withAlpha(0.8),
  //         outlineColor: Color.WHITE,
  //         outlineWidth: 1,
  //         pixelSize: 5,
  //         heightReference: HeightReference.CLAMP_TO_GROUND,
  //         translucencyByDistance: new NearFarScalar(1.5e2, 1.0, 9.0e6, 0.0)
  //       },
  //       label: new LabelGraphics({
  //         text: station.stationId,
  //         font: '12px Arial',
  //         fillColor: Color.WHITE,
  //         pixelOffset: new Cartesian2(22, 15),
  //         translucencyByDistance: new NearFarScalar(1.5e2, 1.0, 5.0e6, 0.0)
  //       })
  //     })
  //   })
  // })
  // sitesCursor.on('update', () => {
  //   sitesCursor.get().map(site => {
  //     viewer.entities.add({
  //       name: `${site.siteName} Camera Site`,
  //       description: jsonMarkup(site, jsonCss),
  //       position: Cartesian3.fromDegrees(parseFloat(site.longitude), parseFloat(site.latitude)),
  //       point: {
  //         color: Color.GREEN,
  //         outlineColor: Color.WHITE,
  //         outlineWidth: 2,
  //         pixelSize: 8,
  //         heightReference: HeightReference.CLAMP_TO_GROUND
  //       }
  //     })
  //   })
  // })
  // navaidsCursor.on('update', () => {
  //   navaidsCursor.get().map(navaid => {
  //     viewer.entities.add({
  //       name: `${navaid.name} (${navaid.navaid}) NAVAID`,
  //       description: jsonMarkup(navaid, jsonCss),
  //       position: Cartesian3.fromDegrees(parseFloat(navaid.longitude), parseFloat(navaid.latitude)),
  //       point: {
  //         color: Color.TRANSPARENT,
  //         outlineColor: Color.BLUE,
  //         outlineWidth: 1.5,
  //         pixelSize: 4,
  //         shadows: true,
  //         heightReference: HeightReference.CLAMP_TO_GROUND,
  //         translucencyByDistance: new NearFarScalar(1.5e2, 1.0, 2.5e6, 0.0)
  //       },
  //       label: new LabelGraphics({
  //         text: navaid.navaid,
  //         font: '12px Arial',
  //         fillColor: Color.WHITE,
  //         pixelOffset: new Cartesian2(22, 15),
  //         translucencyByDistance: new NearFarScalar(1.5e2, 1.0, 4.0e6, 0.0)
  //       })
  //     })
  //   })
  // })
  // const aircraftEntities = []
  // aircraftCursor.on('update', e => {
  //   const aircraftList = e.data.currentData
  //   if (aircraftEntities.length > 0) {
  //     aircraftList.map(aircraft => {
  //       const ac = aircraftEntities.find(a => a.name === `${aircraft.ident} (${aircraft.origin}-${aircraft.destination})`)
  //       if (ac) {
  //         ac.position = Cartesian3.fromDegrees(aircraft.lowLongitude, aircraft.lowLatitude, (aircraft.altitude || 200) * 100 * 0.3048)
  //       }
  //     })
  //     return
  //   }
  //   aircraftList.map(aircraft => {
  //     const position = Cartesian3.fromDegrees(aircraft.lowLongitude, aircraft.lowLatitude, (aircraft.altitude || 200) * 100 * 0.3048)
  //     aircraftEntities.push(viewer.entities.add({
  //       name: `${aircraft.ident} (${aircraft.origin}-${aircraft.destination})`,
  //       description: jsonMarkup(aircraft, jsonCss),
  //       position,
  //       orientation: Transforms.headingPitchRollQuaternion(position, new HeadingPitchRoll(aircraft.heading * 0.01748, -0, 0)),
  //       model: new ModelGraphics({
  //         uri: b739,
  //         minimumPixelSize: 24,
  //         color: Color.WHITE,
  //         scale: 100
  //         // maximumScale: 200
  //       }),
  //       label: new LabelGraphics({
  //         text: `${aircraft.ident} (${aircraft.origin}-${aircraft.destination})`,
  //         font: '16px Arial',
  //         fillColor: Color.WHITE,
  //         style: LabelStyle.FILL_AND_OUTLINE,
  //         pixelOffset: new Cartesian2(0, 25),
  //         translucencyByDistance: new NearFarScalar(1.5e2, 1.0, 1.0e6, 0.0)
  //       })
  //       // billboard: new BillboardGraphics({
  //       //   image: sr71,
  //       //   width: 8,
  //       //   height: 8,
  //       //   alignedAxis: Cartesian3.UNIT_Z,
  //       //   rotation: -1 * (aircraft.heading) * 0.01748
  //       // })
  //     }))
  //     // viewer.trackedEntity = aircraftEntities[aircraftEntities.length]
  //   })
  //   // viewer.trackedEntity = aircraftEntities[0]
  // })
  // notamsCursor.on('update', e => {
  //   const notamsList = e.data.currentData
  //   notamsList.map(notam => {
  //     if (notam.volumes !== null) {
  //       if (!notam.volumes.center || !notam.volumes.center.latitude || !notam.volumes.center.longitude) {
  //         return
  //       }
  //       // console.log(notam)
  //       viewer.entities.add({
  //         name: `notam`,
  //         description: jsonMarkup(notam, jsonCss),
  //         position: Cartesian3.fromDegrees(
  //           parseFloat(notam.volumes.center.longitude),
  //           parseFloat(notam.volumes.center.latitude),
  //           parseFloat(notam.volumes.flightLevelBottomFt || 0) + (notam.volumes.heightFt || 60000) * 0.3048
  //         ),
  //         cylinder: {
  //           material: Color.ORANGE.withAlpha(0.3),
  //           outlineColor: Color.WHITE,
  //           outlineWidth: 1,
  //           outline: true,
  //           length: (notam.volumes.heightFt || 60000) * 0.3048,
  //           topRadius: notam.volumes.radiusNm * 6076.12 * 0.3048,
  //           bottomRadius: notam.volumes.radiusNm * 6076.12 * 0.3048,
  //           heightReference: HeightReference.CLAMP_TO_GROUND
  //         }
  //       })
  //     }
  //   })
  // })
// }

class Globe extends React.Component {
  constructor(props) {
    super(props)
  }
  componentDidMount () {
    didMount({
      airports: this.props.airports
    })
  }
  render () { 
    return (
      <div id='cesium-container' className='cesium-container'></div>
    )
  }
}

export default branch({
  airports: ['airports']
}, Globe)
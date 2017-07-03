import Inferno from 'inferno'

import 'cesium/Source/Widgets/widgets.css'
import BuildModuleUrl from 'cesium/Source/Core/buildModuleUrl'
BuildModuleUrl.setBaseUrl('./cesium')
import Viewer from 'cesium/Source/Widgets/Viewer/Viewer'
import Cartesian2 from 'cesium/Source/Core/Cartesian2'
import Cartesian3 from 'cesium/Source/Core/Cartesian3'
import LabelGraphics from 'cesium/Source/DataSources/LabelGraphics'
import Color from 'cesium/Source/Core/Color'
import BingMapsImageryProvider from 'cesium/Source/Scene/BingMapsImageryProvider'
import utils from '-/utils'
import { bingMapsApiKey } from '../../../config/config'
import jsonMarkup from 'json-markup'
import css2json from 'css2json'
import CesiumTerrainProvider from 'cesium/Source/Core/CesiumTerrainProvider'

import './Globe.scss'

let cesiumViewerOptions = {
  animation: false,
  baseLayerPicker: false,
  fullscreenButton: false,
  geocoder: false,
  homeButton: false,
  // infoBox: false,
  // sceneModePicker: false,
  // selectionIndicator: false,
  timeline: false,
  navigationHelpButton: false,
  navigationInstructionsInitiallyVisible: false,
  automaticallyTrackDataSourceClocks: false,
  imageryProvider: new BingMapsImageryProvider({
    url : 'https://dev.virtualearth.net',
    key : bingMapsApiKey
  })
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

const didMount = (airportsCursor, aircraftReportsCursor, stationsCursor, sitesCursor) => () => {
  const viewer = new Viewer('cesium-container', cesiumViewerOptions)
  const cesiumTerrainProviderMeshes = new CesiumTerrainProvider({
    url : 'https://assets.agi.com/stk-terrain/v1/tilesets/world/tiles',
    requestWaterMask : true,
    requestVertexNormals : true
  });
  viewer.terrainProvider = cesiumTerrainProviderMeshes
  airportsCursor.on('update', () => {
    airportsCursor.get().map(airport => {
      viewer.entities.add({
        name: airport.facilityName,
        label: new LabelGraphics({
          text: airport.icaoIdentifier,
          font: '10px Arial',
          pixelOffset: new Cartesian2(20, 12)
        }),
        position : Cartesian3.fromDegrees(parseFloat(airport.longitude), parseFloat(airport.latitude)),
        point : {
          color : Color.WHITE,
          pixelSize : 13
        }
      })
    })
  })
  aircraftReportsCursor.on('update', () => {
    aircraftReportsCursor.get().map(aircraftReport => {
      viewer.entities.add({
        description: jsonMarkup(aircraftReport.parsed, jsonCss),
        position : Cartesian3.fromDegrees(parseFloat(aircraftReport.longitude), parseFloat(aircraftReport.latitude)),
        point : {
          color : Color.RED,
          pixelSize : 10
        }
      })
    })
    // console.log('mount', airportsCursor.get())
  })
  stationsCursor.on('update', () => {
    stationsCursor.get().map(station => {
      viewer.entities.add({
        name: `${station.stationName} Station`,
        position: Cartesian3.fromDegrees(parseFloat(station.longitude), parseFloat(station.latitude)),
        point : {
          color : Color.BLUE,
          pixelSize : 7
        }
      })
    })
  })
  sitesCursor.on('update', () => {
    sitesCursor.get().map(site => {
      viewer.entities.add({
        name: `${site.siteName} Camera Site`,
        position: Cartesian3.fromDegrees(parseFloat(site.longitude), parseFloat(site.latitude)),
        point : {
          color : Color.GREEN,
          pixelSize : 10
        }
      })
    })
  })
}

const Globe = ({ message, name, incrementCount }) => {
  console.log('render')
  return (
    <div id='cesium-container' className='cesium-container'></div>
  )
}

export default ({ tree }) => (
  <Globe
    onComponentShouldUpdate={ utils.shouldUpdate }
    onComponentDidMount={ didMount(
      tree.select('airports'),
      tree.select('aircraftReports'),
      tree.select('stations'),
      tree.select('sites'),
    ) }
  />
)

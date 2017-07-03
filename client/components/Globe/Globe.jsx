import Inferno from 'inferno'

import 'cesium/Source/Widgets/widgets.css'
import BuildModuleUrl from 'cesium/Source/Core/buildModuleUrl'
BuildModuleUrl.setBaseUrl('./cesium')
import Viewer from 'cesium/Source/Widgets/Viewer/Viewer'
import Cartesian2 from 'cesium/Source/Core/Cartesian2'
import Cartesian3 from 'cesium/Source/Core/Cartesian3'
import LabelGraphics from 'cesium/Source/DataSources/LabelGraphics'
import RectangleGraphics from 'cesium/Source/DataSources/RectangleGraphics'
import Color from 'cesium/Source/Core/Color'
import BingMapsImageryProvider from 'cesium/Source/Scene/BingMapsImageryProvider'
import ArcGisMapServerImageryProvider from 'cesium/Source/Scene/ArcGisMapServerImageryProvider'
import UrlTemplateImageryProvider from 'cesium/Source/Scene/UrlTemplateImageryProvider'
import HeightReference from 'cesium/Source/Scene/HeightReference'
import utils from '-/utils'
import { bingMapsApiKey } from '../../../config/config'
import jsonMarkup from 'json-markup'
import css2json from 'css2json'
import CesiumTerrainProvider from 'cesium/Source/Core/CesiumTerrainProvider'

import './Globe.scss'

let cesiumViewerOptions = {
  animation: false,
  baseLayerPicker: true,
  fullscreenButton: false,
  geocoder: false,
  homeButton: false,
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

const didMount = (airportsCursor, aircraftReportsCursor, stationsCursor, sitesCursor, navaidsCursor) => () => {
  const viewer = new Viewer('cesium-container', cesiumViewerOptions)
  // viewer.scene.imageryLayers.addImageryProvider(new UrlTemplateImageryProvider({
  //   url : 'http://104.197.62.138/map-tiles/vfr/sectional?bbox={westDegrees},{southDegrees},{eastDegrees},{northDegrees}'
  // }))
  viewer.scene.imageryLayers.addImageryProvider(new UrlTemplateImageryProvider({
    url : 'http://104.197.62.138/map-tiles/vfr/terminal-area?bbox={westDegrees},{southDegrees},{eastDegrees},{northDegrees}'
  }))
  const cesiumTerrainProviderMeshes = new CesiumTerrainProvider({
    url: 'https://assets.agi.com/stk-terrain/v1/tilesets/world/tiles',
    requestWaterMask: true,
    requestVertexNormals: true
  })
  viewer.terrainProvider = cesiumTerrainProviderMeshes
  airportsCursor.on('update', () => {
    airportsCursor.get().map(airport => {
      viewer.entities.add({
        name: airport.facilityName,
        label: new LabelGraphics({
          text: airport.icaoIdentifier,
          font: '12px Arial',
          fillColor: Color.WHITE,
          pixelOffset: new Cartesian2(22, 15)
        }),
        position: Cartesian3.fromDegrees(parseFloat(airport.longitude), parseFloat(airport.latitude)),
        point: {
          color: Color.TRANSPARENT,
          outlineColor: Color.WHITE,
          outlineWidth: 1.5,
          pixelSize: 12,
          shadows: true,
          heightReference: HeightReference.CLAMP_TO_GROUND
        }
      })
    })
  })
  aircraftReportsCursor.on('update', () => {
    aircraftReportsCursor.get().map(aircraftReport => {
      viewer.entities.add({
        description: jsonMarkup(aircraftReport.parsed, jsonCss),
        position : Cartesian3.fromDegrees(
          parseFloat(aircraftReport.longitude),
          parseFloat(aircraftReport.latitude),
          parseFloat(aircraftReport.altitudeFtMsl * 0.3048)
        ),
        box: {
          dimensions : new Cartesian3(15000.0, 15000.0, 7500.0),
          material : mapPirepIntensityToColor(aircraftReport.parsed.severity).withAlpha(0.6),
          outline : true,
          outlineColor : Color.WHITE,
          outlineWidth : 2
        }
      })
    })
  })
  stationsCursor.on('update', () => {
    stationsCursor.get().map(station => {
      viewer.entities.add({
        name: `${station.stationName} Station`,
        position: Cartesian3.fromDegrees(parseFloat(station.longitude), parseFloat(station.latitude)),
        point : {
          color : Color.BLUE,
          outlineColor: Color.WHITE,
          outlineWidth: 1,
          pixelSize : 5,
          heightReference: HeightReference.CLAMP_TO_GROUND
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
          outlineColor: Color.WHITE,
          outlineWidth: 2,
          pixelSize : 8,
          heightReference: HeightReference.CLAMP_TO_GROUND
        }
      })
    })
  })
  navaidsCursor.on('update', () => {
    navaidsCursor.get().map(navaid => {
      viewer.entities.add({
        name: `${navaid.name} (${navaid.navaid}) NAVAID`,
        position: Cartesian3.fromDegrees(parseFloat(navaid.longitude), parseFloat(navaid.latitude)),
        point : {
          color : Color.GRAY,
          outlineColor: Color.BLACK,
          outlineWidth: 1,
          pixelSize : 3,
          heightReference: HeightReference.CLAMP_TO_GROUND
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
      tree.select('navaids'),
    ) }
  />
)

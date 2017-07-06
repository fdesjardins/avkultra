import Inferno from 'inferno'

import 'cesium/Source/Widgets/widgets.css'
import BuildModuleUrl from 'cesium/Source/Core/buildModuleUrl'
BuildModuleUrl.setBaseUrl('./cesium')
import Viewer from 'cesium/Source/Widgets/Viewer/Viewer'
import Cartesian2 from 'cesium/Source/Core/Cartesian2'
import Cartesian3 from 'cesium/Source/Core/Cartesian3'
import Transforms from 'cesium/Source/Core/Transforms'
import Quaternion from 'cesium/Source/Core/Quaternion'
import LabelGraphics from 'cesium/Source/DataSources/LabelGraphics'
import BillboardGraphics from 'cesium/Source/DataSources/BillboardGraphics'
import RectangleGraphics from 'cesium/Source/DataSources/RectangleGraphics'
import ConstantProperty from 'cesium/Source/DataSources/ConstantProperty'
import Color from 'cesium/Source/Core/Color'
import BingMapsImageryProvider from 'cesium/Source/Scene/BingMapsImageryProvider'
import NearFarScalar from 'cesium/Source/Core/NearFarScalar'
import ArcGisMapServerImageryProvider from 'cesium/Source/Scene/ArcGisMapServerImageryProvider'
import UrlTemplateImageryProvider from 'cesium/Source/Scene/UrlTemplateImageryProvider'
import HeightReference from 'cesium/Source/Scene/HeightReference'
import BingMapsApi from 'cesium/Source/Core/BingMapsApi'
import utils from '-/utils'
import { bingMapsApiKey } from '-/config'
import jsonMarkup from 'json-markup'
import css2json from 'css2json'
import CesiumTerrainProvider from 'cesium/Source/Core/CesiumTerrainProvider'

import './Globe.scss'
import sr71 from '-/assets/sr71.png'

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
  airportsCursor,
  aircraftReportsCursor,
  stationsCursor,
  sitesCursor,
  navaidsCursor,
  aircraftCursor,
  airepsCursor,
  notamsCursor) => () => {
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
        name: `${airport.facilityName} (${airport.icaoIdentifier}) Airport`,
        description: jsonMarkup(airport, jsonCss),
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
        description: jsonMarkup(aircraftReport, jsonCss),
        position : Cartesian3.fromDegrees(
          parseFloat(aircraftReport.longitude),
          parseFloat(aircraftReport.latitude),
          Math.max(parseFloat(aircraftReport.altitudeFtMsl - (15000 / 2)), 0) * 0.3048
        ),
        box: {
          dimensions : new Cartesian3(25000.0, 25000.0, 15000.0),
          material : mapPirepIntensityToColor(aircraftReport.parsed.severity).withAlpha(0.5),
          outline : true,
          outlineColor : Color.WHITE,
          outlineWidth : 2
        }
      })
    })
  })
  airepsCursor.on('update', () => {
    airepsCursor.get().map(airep => {
      viewer.entities.add({
        description: jsonMarkup(airep, jsonCss),
        position : Cartesian3.fromDegrees(
          parseFloat(airep.longitude),
          parseFloat(airep.latitude),
          parseFloat(airep.altitudeFtMsl - (15000 / 2)) * 0.3048
        ),
        box: {
          dimensions : new Cartesian3(25000.0, 25000.0, 15000.0),
          material : Color.WHITE.withAlpha(0.3),
          outline : true,
          outlineColor : Color.BLACK.withAlpha(0.3),
          outlineWidth : 2
        }
      })
    })
  })
  stationsCursor.on('update', () => {
    stationsCursor.get().map(station => {
      viewer.entities.add({
        name: `${station.stationName} Station`,
        description: jsonMarkup(station, jsonCss),
        position: Cartesian3.fromDegrees(parseFloat(station.longitude), parseFloat(station.latitude)),
        point : {
          color : Color.BLACK.withAlpha(0.8),
          outlineColor: Color.WHITE,
          outlineWidth: 1,
          pixelSize : 5,
          heightReference: HeightReference.CLAMP_TO_GROUND,
          translucencyByDistance: new NearFarScalar(1.5e2, 1.0, 9.0e6, 0.0)
        }
      })
    })
  })
  sitesCursor.on('update', () => {
    sitesCursor.get().map(site => {
      viewer.entities.add({
        name: `${site.siteName} Camera Site`,
        description: jsonMarkup(site, jsonCss),
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
        description: jsonMarkup(navaid, jsonCss),
        position: Cartesian3.fromDegrees(parseFloat(navaid.longitude), parseFloat(navaid.latitude)),
        point : {
          color: Color.TRANSPARENT,
          outlineColor: Color.BLUE,
          outlineWidth: 1.5,
          pixelSize: 4,
          shadows: true,
          heightReference: HeightReference.CLAMP_TO_GROUND,
          translucencyByDistance: new NearFarScalar(1.5e2, 1.0, 2.5e6, 0.0)
        },
        label: new LabelGraphics({
          text: navaid.navaid,
          font: '12px Arial',
          fillColor: Color.WHITE,
          pixelOffset: new Cartesian2(22, 15),
          translucencyByDistance: new NearFarScalar(1.5e2, 1.0, 4.0e6, 0.0)
        })
      })
    })
  })
  aircraftCursor.on('update', e => {
    const aircraftList = e.data.currentData
    aircraftList.map(aircraft => {
      viewer.entities.add({
        name: `${aircraft.ident} (${aircraft.origin}-${aircraft.destination})`,
        description: jsonMarkup(aircraft, jsonCss),
        position: Cartesian3.fromDegrees(aircraft.lowLongitude, aircraft.lowLatitude, (aircraft.altitude || 200) * 100 * 0.3048),
        billboard: new BillboardGraphics({
          image: sr71,
          width: 12,
          height: 12,
          alignedAxis: Cartesian3.UNIT_Z,
          rotation: -1 * (aircraft.heading) * 0.01748
        })
      })
    })
  })
  notamsCursor.on('update', e => {
    const notamsList = e.data.currentData
    notamsList.map(notam => {
      if (notam.volumes !== null) {
        if (!notam.volumes.center || !notam.volumes.center.latitude || !notam.volumes.center.longitude) {
          return
        }
        // console.log(notam)
        viewer.entities.add({
          name: `notam`,
          description: jsonMarkup(notam, jsonCss),
          position: Cartesian3.fromDegrees(
            parseFloat(notam.volumes.center.longitude),
            parseFloat(notam.volumes.center.latitude),
            parseFloat(notam.volumes.flightLevelBottomFt || 0) + (notam.volumes.heightFt || 60000) * 0.3048
          ),
          cylinder : {
            material: Color.ORANGE.withAlpha(0.3),
            outlineColor: Color.WHITE,
            outlineWidth: 1,
            outline: true,
            length: (notam.volumes.heightFt || 60000) * 0.3048,
            topRadius: notam.volumes.radiusNm * 6076.12 * 0.3048,
            bottomRadius: notam.volumes.radiusNm * 6076.12 * 0.3048,
            heightReference: HeightReference.CLAMP_TO_GROUND
          }
        })
      }
    })
  })
}

const Globe = ({ message, name, incrementCount }) => {
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
      tree.select('aircraft'),
      tree.select('aireps'),
      tree.select('notams')
    ) }
  />
)

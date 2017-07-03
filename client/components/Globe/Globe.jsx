import Inferno from 'inferno'

import 'cesium/Source/Widgets/widgets.css'
import BuildModuleUrl from 'cesium/Source/Core/buildModuleUrl'
BuildModuleUrl.setBaseUrl('./cesium')
import Viewer from 'cesium/Source/Widgets/Viewer/Viewer'
import BingMapsImageryProvider from 'cesium/Source/Scene/BingMapsImageryProvider'
import utils from '-/utils'
import { bingMapsApiKey } from '../../../config/config'

import './Globe.scss'

let cesiumViewerOptions = {
  animation: false,
  baseLayerPicker: false,
  fullscreenButton: false,
  geocoder: false,
  homeButton: false,
  infoBox: false,
  sceneModePicker: false,
  selectionIndicator: false,
  timeline: false,
  navigationHelpButton: false,
  navigationInstructionsInitiallyVisible: false,
  automaticallyTrackDataSourceClocks: false,
  imageryProvider: new BingMapsImageryProvider({
    url : 'https://dev.virtualearth.net',
    key : bingMapsApiKey
  })
}

const didMount = () => {
  new Viewer('cesium-container', cesiumViewerOptions)
}

const Globe = ({ message, name, incrementCount }) => {
  return (
    <div id='cesium-container' className='cesium-container'></div>
  )
}

export default ({ tree }) => (
  <Globe
    message={ tree.get('hello') }
    name={ tree.get('name') }
    incrementCount={ tree.get('incrementCount') }
    onComponentShouldUpdate={ utils.shouldUpdate }
    onComponentDidMount={ didMount }
  />
)

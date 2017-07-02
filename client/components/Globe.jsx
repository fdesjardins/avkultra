import Inferno from 'inferno'
import BuildModuleUrl from 'cesium/Source/Core/buildModuleUrl'
BuildModuleUrl.setBaseUrl('./')
import CesiumViewer from 'cesium/Source/Widgets/Viewer/Viewer'
import { addColor } from '../actions/actions'

// BuildModuleUrl.setBaseUrl('./')

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
  automaticallyTrackDataSourceClocks: false
}

const mount = () => {
  console.log('mount')
  new CesiumViewer(document.querySelector('.cesium-container'), cesiumViewerOptions)
}

const Globe = props => (
  <div>
    <span>hola!</span>
    <div className='cesium-container'></div>
  </div>
)

export default (props) => (
  <Globe props={ props} onComponentDidMount={ mount } />
)

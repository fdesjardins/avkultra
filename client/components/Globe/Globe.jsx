import Inferno from 'inferno'

import 'cesium/Source/Widgets/widgets.css'
import BuildModuleUrl from 'cesium/Source/Core/buildModuleUrl'
BuildModuleUrl.setBaseUrl('./cesium/Source')
import Viewer from 'cesium/Source/Widgets/Viewer/Viewer'

import utils from '-/utils'

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
  automaticallyTrackDataSourceClocks: false
}

const didMount = () => {
  new Viewer('cesium-container')
}

const Globe = ({ message, name, incrementCount }) => {
  return (
    <div>
      <span>{ message } { name }</span>
      <button onClick={ incrementCount(2) }>incrementCount</button>
      <div id='cesium-container' className='cesium-container'></div>
    </div>
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

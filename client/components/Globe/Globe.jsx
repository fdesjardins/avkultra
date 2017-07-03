import Inferno from 'inferno'
import BuildModuleUrl from 'cesium/Source/Core/buildModuleUrl'
BuildModuleUrl.setBaseUrl('./')
import CesiumViewer from 'cesium/Source/Widgets/Viewer/Viewer'

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

const mount = () => {
  new CesiumViewer(document.querySelector('.cesium-container'), cesiumViewerOptions)
}

const shouldUpdate = (lastProps, nextProps) => JSON.stringify(lastProps) !== JSON.stringify(nextProps)

const Globe = ({ message, name, incrementCount }) => {
  return (
    <div>
      <span>{ message } { name }</span>
      <button onClick={ incrementCount(2) }>incrementCount</button>
      <div className='cesium-container'></div>
    </div>
  )
}

export default ({ tree }) => {
  return (
    <Globe
      message={ tree.get('hello') }
      name={ tree.get('name') }
      incrementCount={ tree.get('incrementCount') }
      onComponentShouldUpdate={ shouldUpdate }
      onComponentDidMount={ mount }
    />
  )
}

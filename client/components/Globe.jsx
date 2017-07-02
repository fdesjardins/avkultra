import Inferno from 'inferno'

import { addColor } from '../actions/actions'

export default (props) => {
  console.log('here')
  return (
    <div>
      <span>hola!</span>
      <div className='cesium-container'></div>
      <button onClick={ addColor }>add color</button>
    </div>
  )
}

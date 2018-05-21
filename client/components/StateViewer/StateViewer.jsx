import React from 'react'

import './StateViewer.scss'

const StateViewer = ({ state }) => (
  <pre className='state-viewer'>{ JSON.stringify(state, null, 2) }</pre>
)

export default StateViewer

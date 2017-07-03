import Inferno from 'inferno'

import StateViewer from '-/components/StateViewer/StateViewer'
import Globe from '-/components/Globe/Globe'

import './App.scss'

const App = ({ tree }) => (
  <Globe tree={ tree.select('globe') } />
)

export default App

import 'babel-polyfill'
import Baobab from 'baobab'
import React from 'react'
import { render } from 'react-dom'
import { root } from 'baobab-react/higher-order'

import App from '-/components/App/App'
import tree from '-/state'

const RootedApp = root(tree, App)

render(<RootedApp/> , document.querySelector('#app'))

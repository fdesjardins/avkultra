import 'babel-polyfill'

import App from '-/components/App/App'
import { AppContainer } from 'react-hot-loader'
import Baobab from 'baobab'
import React from 'react'
import ReactDOM from 'react-dom'
import { root } from 'baobab-react/higher-order'
import tree from '-/state'

const rootElement = document.getElementById('app')

const RootedApp = root(tree, App)

const render = Component => {
  ReactDOM.render(
    <AppContainer>
      <Component />
    </AppContainer>,
    rootElement
  )
}

render(RootedApp)

if (module.hot) {
  module.hot.accept('./components/App/App', () => {
    render(RootedApp)
  })
}

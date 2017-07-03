import Baobab from 'baobab'
import Inferno from 'inferno'

import App from 'components/App/App'

let initialState

const incrementCount = (amount = 1) => () => {
  initialState.set('count', initialState.get('count') + amount)
}

initialState = new Baobab({
  meta: {
    name: 'avkultra'
  },
  globe: {
    hello: 'hello',
    name: 'wendy',
    incrementCount
  },
  count: 1
})

const initialize = (tree, App) => {
  const render = () => Inferno.render(<App tree={ tree }/>, document.querySelector('#app'))
  tree.on('update', render)
  render()
}

initialize(initialState, App)

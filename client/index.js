import Baobab from 'baobab'
import Inferno from 'inferno'

import App from '-/components/App/App'
import { incrementCount } from '-/actions/actions'

const initialState = new Baobab({
  meta: {
    name: 'avkultra'
  },
  globe: {
    hello: 'hello',
    name: 'wendy',
    count: 1
  }
})

initialState
  .select('globe')
  .set('incrementCount', incrementCount(initialState.select('globe', 'count')))

const initialize = (tree, App) => {
  const render = () => Inferno.render(<App tree={ tree }/>, document.querySelector('#app'))
  tree.on('update', render)
  render()
}

initialize(initialState, App)
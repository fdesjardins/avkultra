import Baobab from 'baobab'
import Inferno from 'inferno'

import Globe from 'components/Globe'

import 'app/index.scss'

const tree = new Baobab({
  meta: {
    name: 'avkultra'
  },
  globe: {
    message: 'hello',
    name: 'wendy'
  },
  count: 1
})

const incrementCount = () => {
  tree.set('count', tree.get('count') + 1)
}

const StateViewer = ({ state }) => (
  <pre className='props'>{ JSON.stringify(state, null, 2) }</pre>
)

const App = ({ tree }) => {
  return (
    <div>
      <StateViewer state={ tree } />
      <button onClick={ incrementCount }>incrementCount</button>
      <Globe tree={ tree } />
    </div>
  )
}

const initialize = (tree, App) => {
  const render = () => Inferno.render(<App tree={ tree }/>, document.querySelector('#app'))
  tree.on('update', render)
  render()
}

initialize(tree, App)

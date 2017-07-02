import Inferno from 'inferno'

import 'app/index.scss'
import tree from 'app/state'
import Globe from 'components/Globe.jsx'
import Baobab from 'baobab'

const initialState = new Baobab({
  meta: {
    name: 'avkultra'
  },
  globe: {
    message: 'hello',
    name: 'wendy'
  }
})

const app = props => (
  <div>
    <h1>props:</h1>
    {/* <Globe props={ props.globe } /> */}
  </div>
)

const initialize = (tree, App) => {
  tree.on('update', () => Inferno.render(<App props={ tree }/>, document.querySelector('#app')))
  Inferno.render(<App props={ tree }/>, document.querySelector('#app'))
}

initialize(tree, app)

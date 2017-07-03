import Baobab from 'baobab'

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

export default initialState

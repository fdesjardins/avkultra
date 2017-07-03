exports.addColor = (tree, color = 'red') => {
  console.log('addColor', color)
  tree.push('colors', color)
}

exports.incrementCount = countCursor => (amount = 1) => () => {
  countCursor.set(countCursor.get() + amount)
}

exports.addColor = (tree, color = 'red') => {
  console.log('addColor', color)
  tree.push('colors', color)
}

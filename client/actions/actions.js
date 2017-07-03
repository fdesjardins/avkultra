exports.incrementCount = countCursor => (amount = 1) => () => {
  countCursor.set(countCursor.get() + amount)
}

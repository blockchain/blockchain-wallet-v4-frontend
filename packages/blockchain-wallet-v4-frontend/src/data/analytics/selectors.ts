import { curry, path } from 'ramda'

export const selectAbTest = curry((test, state) =>
  path(['analytics', 'ab_tests', test], state)
)

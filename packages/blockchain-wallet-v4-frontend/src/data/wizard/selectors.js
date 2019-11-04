import { curry, path } from 'ramda'

export const selectStep = curry((name, state) =>
  path(['wizard', name, 'step'], state)
)

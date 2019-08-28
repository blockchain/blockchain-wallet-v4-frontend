import { path, curry } from 'ramda'

export const selectStep = curry((name, state) =>
  path(['wizard', name, 'step'], state)
)

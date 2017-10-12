import { path, curry } from 'ramda'

export const selectStep = curry((name, state) => path(['application', 'wizard', name, 'step'], state))

import { path, curry } from 'ramda'

export const selectStep = curry((name, state) => path(['applicationState', 'wizard', name, 'step'], state))

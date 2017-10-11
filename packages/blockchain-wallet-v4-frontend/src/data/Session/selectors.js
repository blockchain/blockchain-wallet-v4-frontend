import { path, curry } from 'ramda'

export const getSession = curry((guid, state) => path(['session', guid], state))

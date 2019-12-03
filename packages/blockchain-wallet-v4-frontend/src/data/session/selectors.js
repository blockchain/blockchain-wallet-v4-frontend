import { curry, path } from 'ramda'

export const getSession = curry((state, guid) => path(['session', guid], state))

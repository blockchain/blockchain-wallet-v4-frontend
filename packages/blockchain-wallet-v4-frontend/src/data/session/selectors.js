import { curry, defaultTo, path } from 'ramda'

export const getSession = curry((state, guid, email) => {
  const guidSession = path(['session', guid], state)
  const emailSession = path(['session', email], state)
  return defaultTo(guidSession)(emailSession)
})

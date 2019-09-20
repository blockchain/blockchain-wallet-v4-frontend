import { path, prop } from 'ramda'

export const getMetadata = path(['components', 'coinify'])

export const getState = state => prop('supported', getMetadata(state))

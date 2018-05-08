import { path } from 'ramda'

export const getLastGuid = (state) => path(['cache', 'lastGuid'], state)

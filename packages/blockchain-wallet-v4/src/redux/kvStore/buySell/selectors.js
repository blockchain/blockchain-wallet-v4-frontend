import { BUYSELL } from '../config'
import { kvStorePath } from '../../paths'
import { path } from 'ramda'

export const getMetadata = path([kvStorePath, BUYSELL])

export const getCoinifyUser = state =>
  getMetadata(state).map(path(['value', 'coinify', 'user']))

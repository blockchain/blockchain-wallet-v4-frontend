import { kvStorePath } from '../../paths'
import { path, prop } from 'ramda'
import { WHATSNEW } from '../config'

export const getMetadata = path([kvStorePath, WHATSNEW])

export const getState = state => getMetadata(state).map(prop('value'))

export const getLastViewed = state =>
  getMetadata(state).map(path(['value', 'lastViewed']))

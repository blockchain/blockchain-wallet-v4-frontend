import { path, prop } from 'ramda'

import { WHATSNEW } from '../config'
import { kvStorePath } from '../../paths'

export const getMetadata = path([kvStorePath, WHATSNEW])

export const getState = state => getMetadata(state).map(prop('value'))

export const getLastViewed = state =>
  getMetadata(state).map(path(['value', 'lastViewed']))

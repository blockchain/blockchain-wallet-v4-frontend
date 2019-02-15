import { path } from 'ramda'
import { WHATSNEW } from '../config'
import { kvStorePath } from '../../paths'

export const getMetadata = path([kvStorePath, WHATSNEW])

export const getLastViewed = state =>
  getMetadata(state).map(path(['value', 'lastViewed']))

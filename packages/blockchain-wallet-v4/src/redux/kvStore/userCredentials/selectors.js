import { path } from 'ramda'

import { kvStorePath } from '../../paths'
import { USER_CREDENTIALS } from '../config'

export const getMetadata = path([kvStorePath, USER_CREDENTIALS])

export const getUserId = state =>
  getMetadata(state).map(path(['value', 'user_id']))
export const getLifetimeToken = state =>
  getMetadata(state).map(path(['value', 'lifetime_token']))

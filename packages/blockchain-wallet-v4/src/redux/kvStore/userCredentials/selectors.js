import { path } from 'ramda'
import { USER_CREDENTIALS } from '../config'
import { kvStorePath } from '../../paths'

export const getMetadata = path([kvStorePath, USER_CREDENTIALS])

export const getUserId = state =>
  getMetadata(state).map(path(['value', 'user_id']))
export const getLifetimeToken = state =>
  getMetadata(state).map(path(['value', 'lifetime_token']))

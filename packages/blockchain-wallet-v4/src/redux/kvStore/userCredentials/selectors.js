import { path } from 'ramda'

import { kvStorePath } from '../../paths'
import { USER_CREDENTIALS } from '../config'

export const getMetadata = path([kvStorePath, USER_CREDENTIALS])

export const getExchangeUserId = (state) =>
  getMetadata(state).map(path(['value', 'exchange_user_id']))
export const getExchangeLifetimeToken = (state) =>
  getMetadata(state).map(path(['value', 'exchange_lifetime_token']))

export const getUserId = (state) => getMetadata(state).map(path(['value', 'user_id']))
export const getLifetimeToken = (state) => getMetadata(state).map(path(['value', 'lifetime_token']))

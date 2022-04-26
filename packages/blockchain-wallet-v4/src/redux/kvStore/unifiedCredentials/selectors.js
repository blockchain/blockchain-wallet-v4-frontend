import { path } from 'ramda'

import { kvStorePath } from '../../paths'
import { UNIFIED_CREDENTIALS } from '../config'

export const getMetadata = path([kvStorePath, UNIFIED_CREDENTIALS])

// exchange selectors
export const getExchangeUserId = (state) =>
  getMetadata(state).map(path(['value', 'exchange_user_id']))
export const getExchangeLifetimeToken = (state) =>
  getMetadata(state).map(path(['value', 'exchange_lifetime_token']))

// nabu selectors
export const getNabuUserId = (state) => getMetadata(state).map(path(['value', 'nabu_user_id']))
export const getNabuLifetimeToken = (state) =>
  getMetadata(state).map(path(['value', 'nabu_lifetime_token']))

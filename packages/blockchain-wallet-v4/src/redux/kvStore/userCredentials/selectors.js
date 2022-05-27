import { lift, path } from 'ramda'

import { kvStorePath } from '../../paths'
import { USER_CREDENTIALS } from '../config'

//
// 👋 these selectors are deprecated, please see the new unifiedCredentials entry
//
export const getMetadata = path([kvStorePath, USER_CREDENTIALS])

export const getLegacyUserId = (state) => getMetadata(state).map(path(['value', 'user_id']))
export const getLegacyNabuLifetimeToken = (state) =>
  getMetadata(state).map(path(['value', 'lifetime_token']))

export const getLegacyNabuCredentials = (state) =>
  lift((nabuUserId, nabuLifetimeToken) => ({
    nabuLifetimeToken,
    nabuUserId
  }))(getLegacyUserId(state), getLegacyNabuLifetimeToken(state))

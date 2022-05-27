import { lift, path } from 'ramda'

import { kvStorePath } from '../../paths'
import { UNIFIED_CREDENTIALS } from '../config'
import { getLegacyNabuCredentials } from '../userCredentials/selectors'

export const getMetadata = path([kvStorePath, UNIFIED_CREDENTIALS])

// Exchange
export const getExchangeUserId = (state) =>
  getMetadata(state).map(path(['value', 'exchange_user_id']))
export const getExchangeLifetimeToken = (state) =>
  getMetadata(state).map(path(['value', 'exchange_lifetime_token']))
export const getExchangeCredentials = (state) =>
  lift((exchangeUserId, exchangeLifetimeToken) => ({
    exchangeLifetimeToken,
    exchangeUserId
  }))(getExchangeUserId(state), getExchangeLifetimeToken(state))

// Nabu
export const getNabuUserId = (state) => getMetadata(state).map(path(['value', 'nabu_user_id']))
export const getNabuLifetimeToken = (state) =>
  getMetadata(state).map(path(['value', 'nabu_lifetime_token']))
export const getNabuCredentials = (state) =>
  lift((nabuUserId, nabuLifetimeToken) => ({
    nabuLifetimeToken,
    nabuUserId
  }))(getNabuUserId(state), getNabuLifetimeToken(state))

// smart selector for first trying to get nabu credentials from unified metadata
// else get from legacy userCredentials metadata
export const getUnifiedOrLegacyNabuEntry = (state) => {
  const { nabuLifetimeToken, nabuUserId } = getNabuCredentials(state).getOrElse({})
  if (nabuUserId && nabuLifetimeToken) {
    return getNabuCredentials(state)
  }
  return getLegacyNabuCredentials(state)
}

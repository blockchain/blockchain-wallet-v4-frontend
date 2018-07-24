import { equals, path, prop } from 'ramda'
import { dataPath } from '../../paths'

export const getCoinify = path([dataPath, 'coinify'])

export const getQuote = path([dataPath, 'coinify', 'quote'])

export const getTrades = path([dataPath, 'coinify', 'trades'])

export const getSubscriptions = path([dataPath, 'coinify', 'subscriptions'])

export const getProfile = path([dataPath, 'coinify', 'profile'])

export const getMediums = path([dataPath, 'coinify', 'mediums'])

// Bank account selected to receive sale fiat
export const getAccount = path([dataPath, 'coinify', 'account'])

export const getFiatCurrency = state =>
  getQuote(state).map(quote => {
    const baseCurrency = prop('_baseCurrency', quote)
    return equals(baseCurrency, 'BTC') ? prop('_quoteCurrency', quote) : baseCurrency
  })

export const getLimits = state => getProfile(state).map(path(['_limits']))

export const getLevel = state => getProfile(state).map(path(['_level']))

export const getCurrentLimits = state => getProfile(state).map(path(['currentLimits']))

export const getKycs = state => getProfile(state).map(path(['_kycs']))

export const getDefaultCurrency = path([dataPath, 'coinify', '_default_currency'])

export const getTrade = path([dataPath, 'coinify', 'trade'])

export const canTrade = state => getProfile(state).map(path(['_canTrade']))

export const cannotTradeReason = state => getProfile(state).map(path(['_cannotTradeReason']))

export const getSortedKycs = path([dataPath, 'coinify', 'kycs'])

export const getBankAccounts = state => getMediums(state).map(path(['bank', '_accounts']))

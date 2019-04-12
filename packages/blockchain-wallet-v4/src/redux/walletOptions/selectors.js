import { curry, keys, filter, path, prop, toUpper } from 'ramda'
import { walletOptionsPath } from '../paths'

// general
export const getOptions = path([walletOptionsPath])
export const getDomains = state => getOptions(state).map(prop('domains'))
export const getWebOptions = state =>
  getOptions(state).map(path(['platforms', 'web']))
export const getWalletHelperUrl = state =>
  getDomains(state).map(prop('walletHelper'))
export const getAppEnv = state =>
  getWebOptions(state).map(path(['application', 'environment']))
export const getAnalyticsSiteId = state =>
  getWebOptions(state).map(path(['application', 'analyticsSiteId']))
export const getAnnouncements = state =>
  getWebOptions(state).map(path(['application', 'announcements']))
export const getMigrationRedirects = state =>
  getWebOptions(state).map(
    path(['application', 'enableDomainMigrationRedirects'])
  )
export const getSupportedCoins = state =>
  getWebOptions(state).map(prop('coins'))

// coins
export const getBtcNetwork = state =>
  getSupportedCoins(state).map(path(['BTC', 'config', 'network']))
export const getBchFees = state =>
  getSupportedCoins(state).map(path(['BCH', 'config', 'fees']))
export const getBsvFees = state =>
  getSupportedCoins(state).map(path(['BSV', 'config', 'fees']))
export const getEthTxFuse = state =>
  getSupportedCoins(state).map(path(['ETH', 'lastTxFuse']))
export const getCoinAvailability = curry((state, coin) =>
  getSupportedCoins(state).map(path([toUpper(coin), 'availability']))
)
export const getErc20CoinList = state =>
  getSupportedCoins(state).map(x => keys(filter(c => c.isErc20, x)))
export const getCoinModel = (state, coin) =>
  getSupportedCoins(state).map(x => prop(toUpper(coin), x))

// partners
export const getSFOXCountries = state =>
  getWebOptions(state).map(path(['sfox', 'countries']))
export const getSFOXStates = state =>
  getWebOptions(state).map(path(['sfox', 'states']))
export const getCoinifyCountries = state =>
  getWebOptions(state).map(path(['coinify', 'countries']))
export const getISignThisDomain = state =>
  getWebOptions(state).map(path(['coinify', 'config', 'iSignThisDomain']))
export const getCoinifyPaymentDomain = state =>
  getWebOptions(state).map(path(['coinify', 'config', 'coinifyPaymentDomain']))
export const getVeriffDomain = state => getDomains(state).map(prop('veriff'))
export const getPlaidKey = state =>
  getWebOptions(state).map(path(['sfox', 'config', 'plaid']))
export const getPlaidEnv = state =>
  getWebOptions(state).map(path(['sfox', 'config', 'plaidEnv']))

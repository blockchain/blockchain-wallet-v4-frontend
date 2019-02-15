import { curry, path, prop, toLower } from 'ramda'
import { walletOptionsPath } from '../paths'

// general
export const getOptions = path([walletOptionsPath])
export const getDomains = state => getOptions(state).map(prop('domains'))
export const getWebOptions = state =>
  getOptions(state).map(path(['platforms', 'web']))

// specific
export const getBtcNetwork = state =>
  getWebOptions(state).map(path(['btc', 'config', 'network']))
export const getEthTxFuse = state =>
  getWebOptions(state).map(path(['eth', 'lastTxFuse']))
export const getAnalyticsSiteId = state =>
  getWebOptions(state).map(path(['application', 'analyticsSiteId']))
export const getAnnouncements = state =>
  getWebOptions(state).map(path(['application', 'announcements']))
export const getMigrationRedirects = state =>
  getWebOptions(state).map(
    path(['application', 'enableDomainMigrationRedirects'])
  )
export const getCoinAvailability = curry((state, coin) =>
  getWebOptions(state).map(path([toLower(coin), 'availability']))
)

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
// wallet helper
export const getWalletHelperUrl = state =>
  getDomains(state).map(prop('walletHelper'))

// SFOX / plaid
export const getPlaidKey = state =>
  getWebOptions(state).map(path(['sfox', 'config', 'plaid']))
export const getPlaidEnv = state =>
  getWebOptions(state).map(path(['sfox', 'config', 'plaidEnv']))

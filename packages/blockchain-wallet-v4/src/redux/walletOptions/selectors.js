import { curry, flip, path, prop } from 'ramda'
import { walletOptionsPath } from '../paths'

// general
export const getOptions = path([walletOptionsPath])
export const getDomains = state => getOptions(state).map(path(['domains']))
export const getWebOptions = state =>
  getOptions(state).map(path(['platforms', 'web']))

// specific
export const getBtcNetwork = state =>
  getWebOptions(state).map(path(['btc', 'config', 'network']))
export const getEthTxFuse = state =>
  getWebOptions(state).map(path(['eth', 'lastTxFuse']))
export const getAnnouncements = state =>
  getWebOptions(state).map(path(['application', 'announcements']))
export const getMigrationRedirects = state =>
  getWebOptions(state).map(
    path(['application', 'enableDomainMigrationRedirects'])
  )
export const getCoinAvailablility = curry((state, coin) =>
  getWebOptions(state).map(path([getCoinOptionsName(coin), 'availability']))
)

//
const getCoinOptionsName = flip(prop)({
  BTC: 'btc',
  BCH: 'bch',
  ETH: 'eth',
  XLM: 'xlm'
})

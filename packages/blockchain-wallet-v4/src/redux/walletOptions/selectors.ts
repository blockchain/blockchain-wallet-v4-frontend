import { createDeepEqualSelector } from '../../utils'
import {
  curry,
  filter,
  keys,
  lensProp,
  mapObjIndexed,
  path,
  prop,
  propOr,
  set,
  toUpper
} from 'ramda'
import { getInvitations } from '../settings/selectors'
import { RootState } from 'data/rootReducer'
import { SupportedCoinType } from './types'

// general
export const getOptions = (state: RootState) => state.walletOptionsPath
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

// coins
export const getSupportedCoins = createDeepEqualSelector(
  [getInvitations, getWebOptions],
  (invitationsR, webOptionsR) => {
    const addInvited = (obj, coin) => {
      // @ts-ignore
      const invited = invitationsR.map(propOr(true, coin)).getOrElse(false)
      return set(lensProp('invited'), invited, obj)
    }

    return webOptionsR.map(prop('coins')).map(mapObjIndexed(addInvited))
  }
)
export const getSyncToExchangeList = state =>
  getSupportedCoins(state)
    .map(filter((value: SupportedCoinType) => value.availability.syncToPit))
    .map(keys)
export const getBtcNetwork = state =>
  getSupportedCoins(state).map(path(['BTC', 'config', 'network']))
export const getEthTxFuse = state =>
  getSupportedCoins(state).map(path(['ETH', 'lastTxFuse']))
export const getXlmSendTimeOutSeconds = state =>
  getSupportedCoins(state).map(path(['XLM', 'config', 'sendTimeOutSeconds']))
export const getXlmExchangeAddresses = state =>
  getSupportedCoins(state).map(path(['XLM', 'exchangeAddresses']))
export const getStxCampaign = state =>
  getWebOptions(state).map(path(['coins', 'STX', 'campaign']))
export const getCoinAvailability = curry((state, coin) =>
  getSupportedCoins(state).map(path([toUpper(coin), 'availability']))
)
export const getErc20CoinList = state =>
  getSupportedCoins(state).map(x =>
    keys(filter((c: SupportedCoinType) => !!c.contractAddress, x))
  )
export const getCoinModel = (state, coin) =>
  getSupportedCoins(state).map(x => prop(toUpper(coin), x))
export const getCoinIcons = (state, coin) =>
  // @ts-ignore
  getCoinModel(state, coin).map(path(['icons']))

// domains
export const getVeriffDomain = state => getDomains(state).map(prop('veriff'))

// partners
export const getSiftKey = state =>
  getWebOptions(state).map(path(['sift', 'apiKey']))

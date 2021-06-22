import {
  curry,
  filter,
  keys,
  lensProp,
  map,
  mapObjIndexed,
  path,
  prop,
  propOr,
  set,
  toUpper
} from 'ramda'

import { CoinType, RemoteDataType } from 'core/types'
import { RootState } from 'data/rootReducer'

import { createDeepEqualSelector } from '../../utils'
import { getInvitations } from '../settings/selectors'
import {
  SupportedCoinType,
  SupportedWalletCurrenciesType,
  SupportedWalletCurrencyType,
  WalletOptionsType
} from './types'

// general
export const getOptions = (state: RootState) =>
  state.walletOptionsPath as RemoteDataType<string, WalletOptionsType>
export const getDomains = (state) => getOptions(state).map((x) => x.domains)
export const getWebOptions = (state) =>
  getOptions(state).map(path(['platforms', 'web'])) as RemoteDataType<
    string,
    WalletOptionsType['platforms']['web']
  >
export const getWalletHelperUrl = (state) => getDomains(state).map(prop('walletHelper'))
export const getAppEnv = (state) => getWebOptions(state).map(path(['application', 'environment']))
export const getAnalyticsSiteId = (state) =>
  getWebOptions(state).map(path(['application', 'analyticsSiteId']))
export const getAnnouncements = (state) =>
  getWebOptions(state).map(path(['application', 'announcements']))

// coins
// @ts-ignore
export const getSupportedCoins = createDeepEqualSelector(
  [getInvitations, getWebOptions],
  (invitationsR, webOptionsR) => {
    const addInvited = (obj, coin) => {
      // @ts-ignore
      const invited = invitationsR.map(propOr(true, coin)).getOrElse(false)
      return set(lensProp('invited'), invited, obj)
    }
    // @ts-ignore
    return webOptionsR.map(prop('coins')).map(mapObjIndexed(addInvited))
  }
) as (state: RootState) => RemoteDataType<string, SupportedWalletCurrenciesType>
export const getSyncToExchangeList = (state) =>
  getSupportedCoins(state)
    .map(
      filter(
        (value: SupportedWalletCurrencyType) =>
          // @ts-ignore
          value.availability.syncToPit
      )
    )
    .map(keys)
export const getBtcNetwork = (state) =>
  getSupportedCoins(state).map(path(['BTC', 'config', 'network']))
export const getEthTxFuse = (state) => getSupportedCoins(state).map(path(['ETH', 'lastTxFuse']))
export const getXlmSendTimeOutSeconds = (state) =>
  getSupportedCoins(state).map(path(['XLM', 'config', 'sendTimeOutSeconds']))
export const getXlmExchangeAddresses = (state) =>
  getSupportedCoins(state).map(path(['XLM', 'exchangeAddresses']))
export const getStxCampaign = (state) =>
  getWebOptions(state).map(path(['coins', 'STX', 'campaign']))

// coin feature availability
export const getCoinAvailability = curry((state, coin) =>
  getSupportedCoins(state).map(path([toUpper(coin), 'availability']))
)
export const getAllCoinAvailabilities = (state) => {
  return map(map(prop('availability')), getSupportedCoins(state)) as RemoteDataType<
    any,
    {
      [key in CoinType]: {
        [key in keyof SupportedCoinType['availability']]: boolean
      }
    }
  >
}

export const getErc20CoinList = (state) =>
  getSupportedCoins(state).map((x) =>
    // @ts-ignore
    keys(filter((c: SupportedCoinType) => !!c.contractAddress, x))
  )
export const getCoinModel = (state, coin) =>
  // @ts-ignore
  getSupportedCoins(state).map((x) => prop(toUpper(coin), x))
export const getCoinIcons = (state: RootState, coin) =>
  // @ts-ignore
  getCoinModel(state, coin).map(path(['icons']))

// domains
export const getVeriffDomain = (state: RootState) => getDomains(state).map(prop('veriff'))

// partners
export const getSiftKey = (state: RootState) => getWebOptions(state).map(path(['sift', 'apiKey']))
export const getSiftPaymentKey = (state: RootState) => {
  return getWebOptions(state).map((options) => options.sift.paymentKey)
}
// pairing code feature falag
export const getPairingCodeFlag = (state: RootState) =>
  getWebOptions(state).map(path(['featureFlags', 'legacyMobilePairing']))

// mobile auth flag
export const getMobileAuthFlag = (state: RootState) =>
  getWebOptions(state).map(path(['mobile_auth', 'enabled']))

// brokerage deposits withdrawals flag
export const getBrokerageDepositsWithdrawals = (state: RootState) =>
  getWebOptions(state).map(path(['brokerage_deposits_withdrawals', 'enabled']))

// recurring buys flag
export const getFeatureFlagRecurringBuys = (state: RootState) =>
  getWebOptions(state).map(path(['featureFlags', 'recurringBuys']))

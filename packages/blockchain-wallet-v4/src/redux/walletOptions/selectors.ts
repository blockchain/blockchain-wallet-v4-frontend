import { keys, lift, path, prop } from 'ramda'

import { /* AccountTokensBalancesResponseType, */ ExtractSuccess, RemoteDataType } from 'core/types'
import { RootState } from 'data/rootReducer'

import { createDeepEqualSelector } from '../../utils'
import { getErc20AccountTokenBalances } from '../data/eth/selectors.js'
import { SupportedWalletCurrenciesType, WalletOptionsType } from './types'

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
export const getSupportedCoins = createDeepEqualSelector(
  [getWebOptions, getErc20AccountTokenBalances],
  (webOptionsR /* , erc20CoinsR */) => {
    const newSupportedCoinAccount = (symbol: string) => {
      const { coinfig } = window.coins[symbol]

      return {
        coinCode: coinfig.symbol,
        coinTicker: coinfig.symbol,
        coinfig,
        displayName: coinfig.name,
        minConfirmations: 3
      }
    }

    const transform = (
      webOptions: ExtractSuccess<typeof webOptionsR>
      // TODO: erc20 phase 2, use erc20s from AccountTokenBalances
      // erc20Coins: AccountTokensBalancesResponseType['tokenAccounts']
    ) => {
      return {
        ...webOptions.coins,
        // TODO: erc20 phase 2, remove this
        ...Object.keys(window.coins).reduce((previousValue, currentValue) => {
          const { coinfig } = window.coins[currentValue]
          if (!coinfig.type.erc20Address) return previousValue
          return {
            ...previousValue,
            [coinfig.symbol]: newSupportedCoinAccount(coinfig.symbol)
          }
        }, {})
        // TODO: erc20 phase 2, add this
        // ...erc20Coins.reduce((previousValue, currentValue) => {
        //   return {
        //     ...previousValue,
        //     [currentValue.symbol!]: newSupportedCoinAccount(currentValue.symbol!)
        //   }
        // }, {})
      }
    }
    // TODO: erc20 phase 2, add back erc20CoinsR
    return lift(transform)(webOptionsR /* , erc20CoinsR */)
  }
) as (state: RootState) => RemoteDataType<string, SupportedWalletCurrenciesType>

export const getSyncToExchangeList = (state) => getSupportedCoins(state).map(keys)
export const getXlmSendTimeOutSeconds = (state) =>
  getSupportedCoins(state).map(path(['XLM', 'config', 'sendTimeOutSeconds']))
export const getXlmExchangeAddresses = (state) =>
  getSupportedCoins(state).map(path(['XLM', 'exchangeAddresses']))

// domains
export const getVeriffDomain = (state) => getDomains(state).map(prop('veriff'))

// partners
export const getSiftKey = (state) => getWebOptions(state).map(path(['sift', 'apiKey']))
export const getSiftPaymentKey = (state: RootState) => {
  return getWebOptions(state).map((options) => options.sift.paymentKey)
}
// pairing code feature falag
export const getPairingCodeFlag = (state: RootState) =>
  getWebOptions(state).map(path(['featureFlags', 'legacyMobilePairing']))

// mobile auth flag
export const getMobileAuthFlag = (state) =>
  getWebOptions(state).map(path(['mobile_auth', 'enabled']))

// brokerage deposits withdrawals flag
export const getBrokerageDepositsWithdrawals = (state) =>
  getWebOptions(state).map(path(['brokerage_deposits_withdrawals', 'enabled']))

// recurring buys flag
export const getFeatureFlagRecurringBuys = (state: RootState) =>
  getWebOptions(state).map(path(['featureFlags', 'recurringBuys']))

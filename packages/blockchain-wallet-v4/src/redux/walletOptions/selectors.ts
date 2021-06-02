import { curry, filter, keys, lift, map, path, prop, toUpper } from 'ramda'

import {
  AccountTokensBalancesResponseType,
  CoinType,
  ExtractSuccess,
  RemoteDataType
} from 'core/types'
import { RootState } from 'data/rootReducer'

import { createDeepEqualSelector } from '../../utils'
import { getErc20AccountTokenBalances } from '../data/eth/selectors.js'
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
export const getSupportedCoins = createDeepEqualSelector(
  [getWebOptions, getErc20AccountTokenBalances],
  (webOptionsR, erc20CoinsR) => {
    const newSupportedCoinAccount = (symbol: string) => {
      const { coinfig } = window.coins[symbol]

      return {
        coinCode: coinfig.symbol,
        coinTicker: coinfig.symbol,
        coinfig,
        displayName: coinfig.name,
        minConfirmations: 3,
        txListAppRoute: `/${coinfig.symbol}/transactions`
      }
    }

    const transform = (
      webOptions: ExtractSuccess<typeof webOptionsR>,
      erc20Coins: AccountTokensBalancesResponseType['tokenAccounts']
    ) => {
      return {
        ...webOptions.coins,
        ...erc20Coins.reduce((previousValue, currentValue) => {
          return {
            ...previousValue,
            [currentValue.symbol!]: newSupportedCoinAccount(currentValue.symbol!)
          }
        }, {})
      }
    }
    return lift(transform)(webOptionsR, erc20CoinsR)
  }
) as (state: RootState) => RemoteDataType<string, SupportedWalletCurrenciesType>

export const getSyncToExchangeList = (state) => getSupportedCoins(state).map(keys)
export const getBtcNetwork = (state) =>
  getSupportedCoins(state).map(path(['BTC', 'config', 'network']))
export const getEthTxFuse = (state) => getSupportedCoins(state).map(path(['ETH', 'lastTxFuse']))
export const getXlmSendTimeOutSeconds = (state) =>
  getSupportedCoins(state).map(path(['XLM', 'config', 'sendTimeOutSeconds']))
export const getXlmExchangeAddresses = (state) =>
  getSupportedCoins(state).map(path(['XLM', 'exchangeAddresses']))
export const getStxCampaign = (state) =>
  getWebOptions(state).map(path(['coins', 'STX', 'campaign']))

export const getErc20CoinList = (state): RemoteDataType<any, CoinType[]> =>
  getSupportedCoins(state).map(
    (x) =>
      // @ts-ignore
      keys(
        // @ts-ignore
        filter((c: SupportedCoinType) => !!c.contractAddress, x)
      ) as CoinType[]
  )
export const getCoinModel = (state, coin) =>
  // @ts-ignore
  getSupportedCoins(state).map((x) => prop(toUpper(coin), x))
export const getCoinIcons = (state, coin) =>
  // @ts-ignore
  getCoinModel(state, coin).map(path(['icons']))

// domains
export const getVeriffDomain = (state) => getDomains(state).map(prop('veriff'))

// partners
export const getSiftKey = (state) => getWebOptions(state).map(path(['sift', 'apiKey']))
export const getSiftPaymentKey = (state: RootState) => {
  return getWebOptions(state).map((options) => options.sift.paymentKey)
}

// mobile auth flag
export const getMobileAuthFlag = (state) =>
  getWebOptions(state).map(path(['mobile_auth', 'enabled']))

// brokerage deposits withdrawals flag
export const getBrokerageDepositsWithdrawals = (state) =>
  getWebOptions(state).map(path(['brokerage_deposits_withdrawals', 'enabled']))

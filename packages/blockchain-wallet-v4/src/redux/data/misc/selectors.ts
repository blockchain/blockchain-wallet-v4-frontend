import { keys, map } from 'ramda'

import { Remote } from 'blockchain-wallet-v4/src'
import { FiatCurrencies } from 'blockchain-wallet-v4/src/exchange/currencies'
import { INVALID_COIN_TYPE } from 'blockchain-wallet-v4/src/model'
import {
  CoinType,
  RatesType,
  RemoteDataType,
  TimeRange,
  WalletCurrencyType
} from 'core/types'
import { RootState } from 'data/rootReducer'

import * as selectors from '../../selectors'

export const getCaptcha = (state: RootState) => state.dataPath.misc.captcha

export const getPriceIndexSeries = (state: RootState) =>
  state.dataPath.misc.price_index_series

export const getLogs = (state: RootState) => state.dataPath.misc.logs

export const getPairingCode = (state: RootState) =>
  state.dataPath.misc.pairing_code

export const authorizeLogin = (state: RootState) =>
  state.dataPath.misc.authorize_login

export const handle2FAReset = (state: RootState) =>
  state.dataPath.misc.handle_2fa_reset

export const verifyEmailToken = (state: RootState) =>
  state.dataPath.misc.verify_email_token

export const getPriceChange = (
  coin: CoinType,
  range: TimeRange,
  state: RootState
) => state.dataPath.misc.price_change[range][coin]

export const getRatesSelector = (
  coin: WalletCurrencyType,
  state
): RemoteDataType<string, RatesType> => {
  switch (coin) {
    case 'EUR':
    case 'GBP':
    case 'USD':
    case 'BTC':
      return selectors.data.btc.getRates(state)
    case 'BCH':
      return selectors.data.bch.getRates(state)
    case 'DOT':
      return selectors.data.dot.getRates(state)
    case 'ETH':
      return selectors.data.eth.getRates(state)
    case 'XLM':
      return selectors.data.xlm.getRates(state)
    case 'ALGO':
      return selectors.data.algo.getRates(state)
    case 'USDT':
      return selectors.data.eth.getErc20Rates(state, 'usdt')
    case 'WDGLD':
      return selectors.data.eth.getErc20Rates(state, 'wdgld')
    case 'PAX':
      return selectors.data.eth.getErc20Rates(state, 'pax')
    case 'AAVE':
      return selectors.data.eth.getErc20Rates(state, 'aave')
    case 'YFI':
      return selectors.data.eth.getErc20Rates(state, 'yfi')
    default:
      return Remote.Failure(INVALID_COIN_TYPE)
  }
}

// @ts-ignore
const missingRatesFallback = map(
  fiat => ({
    [fiat]: {
      '15m': 0,
      buy: 0,
      last: 0,
      sell: 0,
      symbol: fiat
    }
  }),
  keys(FiatCurrencies)
) as RatesType

export const getAllCoinRatesSelector = (state): any => {
  return {
    AAVE: selectors.data.eth
      .getErc20Rates(state, 'aave')
      .getOrElse(missingRatesFallback),
    ALGO: selectors.data.algo.getRates(state).getOrElse(missingRatesFallback),
    BCH: selectors.data.bch.getRates(state).getOrElse(missingRatesFallback),
    BTC: selectors.data.btc.getRates(state).getOrElse(missingRatesFallback),
    DOT: selectors.data.dot.getRates(state).getOrElse(missingRatesFallback),
    ETH: selectors.data.eth.getRates(state).getOrElse(missingRatesFallback),
    PAX: selectors.data.eth
      .getErc20Rates(state, 'pax')
      .getOrElse(missingRatesFallback),
    USDT: selectors.data.eth
      .getErc20Rates(state, 'usdt')
      .getOrElse(missingRatesFallback),
    XLM: selectors.data.xlm.getRates(state).getOrElse(missingRatesFallback),
    WDGLD: selectors.data.eth
      .getErc20Rates(state, 'wdgld')
      .getOrElse(missingRatesFallback),
    YFI: selectors.data.eth
      .getErc20Rates(state, 'yfi')
      .getOrElse(missingRatesFallback)
  }
}

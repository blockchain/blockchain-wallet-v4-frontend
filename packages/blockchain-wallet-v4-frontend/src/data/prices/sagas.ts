import moment from 'moment'
import { call, put, select } from 'redux-saga/effects'

import { APIType } from 'core/network/api'
import { selectors } from 'data'

import * as A from './actions'
import { CoinPricesRequestType } from './types'

export default ({ api }: { api: APIType }) => {
  const defaultCoins = Object.keys(window.coins).filter(
    (coin) => !window.coins[coin].coinfig.type.isFiat
  )

  const fetchCoinPrices = function* (action) {
    const { coins, fiatCurrency, timestamp }: CoinPricesRequestType = action.payload
    try {
      yield put(A.fetchCoinPricesLoading())

      // assume wallet currency if one was not passed in
      const defaultFiat = (yield select(selectors.core.settings.getCurrency)).getOrElse('USD')

      // build request model
      const request = (coins || defaultCoins).map((coin) => ({
        base: coin,
        quote: fiatCurrency || defaultFiat
      }))
      const data = yield call(api.getCoinPrices, request, timestamp)
      yield put(A.fetchCoinPricesSuccess(data))
    } catch (e) {
      yield put(A.fetchCoinPricesFailure(e.message))
    }
  }

  const fetchCoinPricesPreviousDay = function* (action) {
    const { coins, fiatCurrency }: CoinPricesRequestType = action.payload
    try {
      yield put(A.fetchCoinPricesPreviousDayLoading())

      // get timestamp from 24 hours ago
      const timestamp = moment().subtract(1, 'days').unix()

      // assume wallet currency if one was not passed in
      const defaultFiat = (yield select(selectors.core.settings.getCurrency)).getOrElse('USD')

      // build request model
      const request = (coins || defaultCoins).map((coin) => ({
        base: coin,
        quote: fiatCurrency || defaultFiat
      }))
      const data = yield call(api.getCoinPrices, request, timestamp)
      yield put(A.fetchCoinPricesPreviousDaySuccess(data))
    } catch (e) {
      yield put(A.fetchCoinPricesPreviousDayFailure(e.message))
    }
  }

  return {
    fetchCoinPrices,
    fetchCoinPricesPreviousDay
  }
}

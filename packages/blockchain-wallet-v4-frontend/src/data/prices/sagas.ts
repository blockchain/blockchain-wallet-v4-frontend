import { getUnixTime, subDays } from 'date-fns'
import { call, put, select } from 'redux-saga/effects'

import { APIType } from '@core/network/api'
import { IndexMultiResponseType } from '@core/network/api/coin/types'
import { selectors } from 'data'

import { actions as A } from './slice'
import { CoinPricesRequestType } from './types'

export default ({ api }: { api: APIType }) => {
  const fetchCoinPrices = function* (action) {
    const { coins, fiatCurrency, timestamp }: CoinPricesRequestType = action.payload
    try {
      yield put(A.fetchCoinPricesLoading())

      const defaultCoins = selectors.core.data.coins.getAllCoins()

      // assume wallet currency if one was not passed in
      const defaultFiat = (yield select(selectors.core.settings.getCurrency)).getOrElse('USD')

      // build request model
      const request = (coins || defaultCoins).map((coin) => ({
        base: coin,
        quote: fiatCurrency || defaultFiat
      }))
      const data: IndexMultiResponseType = yield call(api.getCoinPrices, request, timestamp)
      yield put(A.fetchCoinPricesSuccess(data))
    } catch (e) {
      yield put(A.fetchCoinPricesFailure(e.message))
    }
  }

  const fetchCoinPricesPreviousDay = function* (action) {
    const { coins, fiatCurrency }: CoinPricesRequestType = action.payload
    try {
      yield put(A.fetchCoinPricesPreviousDayLoading())

      const defaultCoins = selectors.core.data.coins.getAllCoins()

      // get timestamp from 24 hours ago
      const timestamp = getUnixTime(subDays(new Date(), 1))

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

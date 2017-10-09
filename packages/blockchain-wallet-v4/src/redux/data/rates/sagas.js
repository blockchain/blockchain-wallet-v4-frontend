import { delay } from 'redux-saga'
import { call, put } from 'redux-saga/effects'
import * as A from './actions'

export const ratesSaga = ({ api } = {}) => {
  const refreshRatesDelay = 600000

  const refreshBitcoinRates = function * () {
    while (true) {
      const response = yield call(api.getTicker)
      yield put(A.setBitcoinRates(response))
      yield call(delay, refreshRatesDelay)
    }
  }

  const refreshEthereumRates = function * () {
    while (true) {
      const response = yield call(api.getEthTicker)
      yield put(A.setEthereumRates(response))
      yield call(delay, refreshRatesDelay)
    }
  }

  return {
    refreshBitcoinRates,
    refreshEthereumRates
  }
}

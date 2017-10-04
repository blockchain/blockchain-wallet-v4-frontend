import { delay } from 'redux-saga'
import { call, put, fork } from 'redux-saga/effects'
import * as A from './actions'

export const ratesSaga = ({ api } = {}) => {
  const refreshRatesDelay = 600000

  const refreshBitcoinRates = function * () {
    while (true) {
      try {
        const response = yield call(api.getTicker)
        yield put(A.fetchBtcRatesSuccess(response))
      } catch (error) {
        yield put(A.fetchBtcRatesError(error))
      }
      yield call(delay, refreshRatesDelay)
    }
  }

  const refreshEthereumRates = function * () {
    while (true) {
      try {
        const response = yield call(api.getEthTicker)
        yield put(A.fetchEthRatesSuccess(response))
      } catch (error) {
        yield put(A.fetchEthRatesError(error))
      }
      yield call(delay, refreshRatesDelay)
    }
  }

  return function * () {
    yield [
      fork(refreshBitcoinRates),
      fork(refreshEthereumRates)
    ]
  }
}

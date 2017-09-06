import { delay } from 'redux-saga'
import { call, put } from 'redux-saga/effects'
import * as A from './actions'

export const btcRatesSaga = ({ api } = {}) => {
  const refreshRatesDelay = 600000

  const refreshRates = function * () {
    while (true) {
      try {
        let response = yield call(api.getTicker)
        yield put(A.fetchBtcRatesSuccess(response))
      } catch (error) {
        yield put(A.fetchBtcRatesError(error))
      }
      yield call(delay, refreshRatesDelay)
    }
  }

  return refreshRates
}

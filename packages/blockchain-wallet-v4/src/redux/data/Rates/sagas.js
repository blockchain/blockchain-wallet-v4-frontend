import { delay } from 'redux-saga'
import { call, put } from 'redux-saga/effects'
import * as A from './actions'

export const ratesSaga = ({ api } = {}) => {
  const refreshRatesDelay = 600000

  const refreshRates = function * () {
    while (true) {
      try {
        let response = yield call(api.getTicker)
        yield put(A.fetchRatesSuccess(response))
      } catch (error) {
        yield put(A.fetchRatesError(error))
      }
      yield call(delay, refreshRatesDelay)
    }
  }

  return refreshRates
}

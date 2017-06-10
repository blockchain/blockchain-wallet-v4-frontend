import { delay } from 'redux-saga'
import { call, put } from 'redux-saga/effects'
import * as A from './actions'

export const ratesSaga = ({ api } = {}) => {
  const refreshRatesDelay = 600000

  const refreshRates = function * () {
    while (true) {
      let response = yield call(api.getTicker)
      // dispatch to reducers
      yield put(A.loadRatesData(response))
      yield call(delay, refreshRatesDelay)
    }
  }

  return refreshRates
}

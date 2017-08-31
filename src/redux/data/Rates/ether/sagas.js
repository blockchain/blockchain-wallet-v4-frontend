import { delay } from 'redux-saga'
import { call, put } from 'redux-saga/effects'
import * as A from './actions'

export const ethRatesSaga = ({ api } = {}) => {
  const refreshRatesDelay = 600000

  const refreshRates = function * () {
    while (true) {
      try {
        let ethResponse = yield call(api.getEthTicker)
        yield put(A.fetchEthRatesSuccess(ethResponse))
      } catch (error) {
        yield put(A.fetchEthRatesError(error))
      }
      yield call(delay, refreshRatesDelay)
    }
  }

  return refreshRates
}

import { delay } from 'redux-saga'
import { call, put } from 'redux-saga/effects'
import * as A from './actions'

export const ratesSaga = ({ api } = {}) => {
  const refreshRatesDelay = 600000

  const refreshRates = function * () {
    while (true) {
      try {
        let response = yield call(api.getTicker)
        yield put(A.loadRatesData(response))
      } catch (e) {
        console.log('ERROR : fetch rates failed')
      }
      yield call(delay, refreshRatesDelay)
    }
  }

  return refreshRates
}

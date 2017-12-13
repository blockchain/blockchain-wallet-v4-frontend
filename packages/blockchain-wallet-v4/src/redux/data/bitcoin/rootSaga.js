
import { call, put, takeLatest } from 'redux-saga/effects'
import { delay } from 'redux-saga'
import * as AT from './actionTypes'
import * as A from './actions'

export const bitcoinSaga = ({ api } = {}) => {
  console.log('bitcoinSaga creator')
  const fetchRates = function * () {
    console.log('fetch rates in')
    try {
      const response = yield call(api.getBitcoinTicker)
      yield call(delay, 2000)
      yield put(A.fetchRatesSuccess(response))
    } catch (e) {
      yield put(A.fetchRatesFailure(e.message))
    }
  }

  return function * () {
    console.log(' bitcoin saga in')
    yield takeLatest(AT.FETCH_BITCOIN_RATES, fetchRates)
  }
}

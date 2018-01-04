
import { call, put, takeLatest } from 'redux-saga/effects'
import { delay } from 'redux-saga'
import { delayAjax } from '../../paths'
import { all, map } from 'ramda'
import * as AT from './actionTypes'
import * as A from './actions'

export default ({ api } = {}) => {
  const fetchBtcEth = function * () {
    try {
      const data = yield call(api.getBtcEth)
      yield call(delay, delayAjax)
      yield put(A.fetchBtcEthSuccess(data))
    } catch (e) {
      yield put(A.fetchBtcEthFailure(e.message))
      throw e
    }
  }

  const fetchEthBtc = function * () {
    try {
      const data = yield call(api.getEthBtc)
      yield call(delay, delayAjax)
      yield put(A.fetchEthBtcSuccess(data))
    } catch (e) {
      yield put(A.fetchEthBtcFailure(e.message))
      throw e
    }
  }

  const getTradeStatus = function * (address) {
    const response = yield call(api.getTradeStatus, address)
    yield put(A.setTradeStatus(response))
  }

  const fetchTradesStatuses = function * ({ addresses }) {
    yield all(map(a => call(getTradeStatus, a), addresses))
  }

  return function * () {
    yield takeLatest(AT.FETCH_BTC_ETH, fetchBtcEth)
    yield takeLatest(AT.FETCH_ETH_BTC, fetchEthBtc)
    yield takeLatest(AT.FETCH_TRADES_STATUSES, fetchTradesStatuses)
  }
}

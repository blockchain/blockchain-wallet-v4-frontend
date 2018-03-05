import { call, put, takeEvery, takeLatest } from 'redux-saga/effects'
import { delay } from 'redux-saga'
import { delayAjax } from '../../paths'
import * as AT from './actionTypes'
import * as A from './actions'

export default ({ api } = {}) => {
  const fetchBtcEth = function * () {
    try {
      const data = yield call(api.getBtcEth)
      yield put(A.fetchBtcEthLoading())
      yield call(delay, delayAjax)
      yield put(A.fetchBtcEthSuccess(data))
    } catch (e) {
      yield put(A.fetchBtcEthFailure(e.message))
    }
  }

  const fetchEthBtc = function * () {
    try {
      const data = yield call(api.getEthBtc)
      yield put(A.fetchEthBtcLoading())
      yield call(delay, delayAjax)
      yield put(A.fetchEthBtcSuccess(data))
    } catch (e) {
      yield put(A.fetchEthBtcFailure(e.message))
    }
  }

  // const getTradeStatus = function * (address) {
  //   const response = yield call(api.getTradeStatus, address)
  //   yield put(A.setTradeStatus(response))
  // }

  // const fetchTradesStatuses = function * ({ addresses }) {
  //   yield all(map(a => call(getTradeStatus, a), addresses))
  // }

  const fetchTradeStatus = function * (action) {
    const { address } = action.payload
    try {
      const data = yield call(api.getTradeStatus, address)
      yield put(A.fetchTradeStatusLoading(address))
      yield call(delay, delayAjax)
      yield put(A.fetchTradeStatusSuccess(data, address))
    } catch (e) {
      yield put(A.fetchTradeStatusFailure(e.message, address))
    }
  }

  return function * () {
    yield takeLatest(AT.FETCH_BTC_ETH, fetchBtcEth)
    yield takeLatest(AT.FETCH_ETH_BTC, fetchEthBtc)
    // yield takeLatest(AT.FETCH_TRADES_STATUSES, fetchTradesStatuses)
    yield takeEvery(AT.FETCH_TRADE_STATUS, fetchTradeStatus)
  }
}

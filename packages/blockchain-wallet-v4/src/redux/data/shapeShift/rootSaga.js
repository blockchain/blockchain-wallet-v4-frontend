
import { call, fork, put, take, takeEvery, takeLatest } from 'redux-saga/effects'
import { delay } from 'redux-saga'
import { has, prop } from 'ramda'
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

  const fetchShapeshiftOrder = function * (action) {
    try {
      const { depositAmount, pair, returnAddress, withdrawal } = action.payload
      const data = yield call(api.createQuote, depositAmount, pair, returnAddress, withdrawal)
      yield put(A.fetchShapeshiftOrderLoading())
      yield call(delay, delayAjax)
      yield put(A.fetchShapeshiftOrderSuccess(data))
    } catch (e) {
      yield put(A.fetchShapeshiftOrderFailure(e.message))
    }
  }

  const fetchShapeshiftQuotation = function * (action) {
    try {
      const { depositAmount, pair } = action.payload
      yield put(A.fetchShapeshiftQuotationLoading())
      const data = yield call(api.createQuote, depositAmount, pair)
      yield call(delay, delayAjax)
      if (has('error', data)) throw new Error(prop('error', data))
      yield put(A.fetchShapeshiftQuotationSuccess(data))
    } catch (e) {
      yield put(A.fetchShapeshiftQuotationFailure(e.message))
    }
  }

  return function * () {
    yield takeLatest(AT.FETCH_BTC_ETH, fetchBtcEth)
    yield takeLatest(AT.FETCH_ETH_BTC, fetchEthBtc)
    yield takeEvery(AT.FETCH_TRADE_STATUS, fetchTradeStatus)
    yield takeEvery(AT.FETCH_SHAPESHIFT_ORDER, fetchShapeshiftOrder)
    yield takeEvery(AT.FETCH_SHAPESHIFT_QUOTATION, fetchShapeshiftQuotation)
  }
}

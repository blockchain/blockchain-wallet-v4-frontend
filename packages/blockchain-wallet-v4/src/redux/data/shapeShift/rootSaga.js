
import { call, put, takeLatest } from 'redux-saga/effects'
import { delay } from 'redux-saga'
import { delayAjax } from '../../paths'
import { has, prop } from 'ramda'
import * as AT from './actionTypes'
import * as A from './actions'

export default ({ api } = {}) => {
  const fetchBtcEth = function * () {
    try {
      yield put(A.fetchBtcEthLoading())
      const data = yield call(api.getBtcEth)
      yield call(delay, delayAjax)
      yield put(A.fetchBtcEthSuccess(data))
    } catch (e) {
      yield put(A.fetchBtcEthFailure(e.message))
    }
  }

  const fetchEthBtc = function * () {
    try {
      yield put(A.fetchEthBtcLoading())
      const data = yield call(api.getEthBtc)
      yield call(delay, delayAjax)
      yield put(A.fetchEthBtcSuccess(data))
    } catch (e) {
      yield put(A.fetchEthBtcFailure(e.message))
    }
  }

  const fetchTradeStatus = function * (action) {
    const { address } = action.payload
    try {
      yield put(A.fetchTradeStatusLoading(address))
      const data = yield call(api.getTradeStatus, address)
      yield call(delay, delayAjax)
      yield put(A.fetchTradeStatusSuccess(data, address))
    } catch (e) {
      yield put(A.fetchTradeStatusFailure(e.message, address))
    }
  }

  const fetchShapeshiftOrder = function * (action) {
    try {
      const { depositAmount, pair, returnAddress, withdrawal } = action.payload
      yield put(A.fetchShapeshiftOrderLoading())
      const data = yield call(api.createQuote, depositAmount, pair, returnAddress, withdrawal)
      yield call(delay, delayAjax)
      yield put(A.fetchShapeshiftOrderSuccess(data))
    } catch (e) {
      yield put(A.fetchShapeshiftOrderFailure(e.message))
    }
  }

  const fetchShapeshiftQuotation = function * (action) {
    try {
      const { amount, pair, isDeposit } = action.payload
      yield put(A.fetchShapeshiftQuotationLoading())
      const data = yield call(api.createQuote, amount, pair, isDeposit)
      if (has('error', data)) {
        yield put(A.fetchShapeshiftQuotationFailure(prop('error', data)))
      } else {
        yield put(A.fetchShapeshiftQuotationSuccess(prop('success', data)))
      }
    } catch (e) {
      yield put(A.fetchShapeshiftQuotationFailure(e.message))
    }
  }

  return function * () {
    yield takeLatest(AT.FETCH_BTC_ETH, fetchBtcEth)
    yield takeLatest(AT.FETCH_ETH_BTC, fetchEthBtc)
    yield takeLatest(AT.FETCH_TRADE_STATUS, fetchTradeStatus)
    yield takeLatest(AT.FETCH_SHAPESHIFT_ORDER, fetchShapeshiftOrder)
    yield takeLatest(AT.FETCH_SHAPESHIFT_QUOTATION, fetchShapeshiftQuotation)
  }
}

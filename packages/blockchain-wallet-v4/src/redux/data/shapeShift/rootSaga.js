
import { call, put, takeLatest, delay } from 'redux-saga/effects'
import { has, prop } from 'ramda'
import * as AT from './actionTypes'
import * as A from './actions'

export default ({ api } = {}) => {
  const fetchBtcEth = function * () {
    try {
      yield put(A.fetchBtcEthLoading())
      const data = yield call(api.getBtcEth)
      yield put(A.fetchBtcEthSuccess(data))
    } catch (e) {
      yield put(A.fetchBtcEthFailure(e.message))
    }
  }

  const fetchEthBtc = function * () {
    try {
      yield put(A.fetchEthBtcLoading())
      const data = yield call(api.getEthBtc)
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
      yield put(A.fetchTradeStatusSuccess(data, address))
    } catch (e) {
      yield put(A.fetchTradeStatusFailure(e.message, address))
    }
  }

  const fetchOrder = function * (action) {
    try {
      const { depositAmount, pair, returnAddress, withdrawal } = action.payload
      yield put(A.fetchOrderLoading())
      const data = yield call(api.createOrder, depositAmount, pair, returnAddress, withdrawal)
      // yield call(delay, 30000)
      if (has('error', data)) {
        yield put(A.fetchOrderFailure(prop('error', data)))
      } else {
        yield put(A.fetchOrderSuccess(prop('success', data)))
      }
    } catch (e) {
      yield put(A.fetchOrderFailure(e.message))
    }
  }

  // const watchShapeshiftQuotation = function * (action) {
  //   while (true) {
  //     const action = yield take(AT.FETCH_SHAPESHIFT_QUOTATION)
  //     yield call(fetchQuotation, action)
  //   }
  // }

  const fetchQuotation = function * (action) {
    try {
      const { amount, pair, isDeposit } = action.payload
      yield put(A.fetchQuotationLoading())
      const data = yield call(api.createQuote, amount, pair, isDeposit)
      if (has('error', data)) {
        yield put(A.fetchQuotationFailure(prop('error', data)))
      } else {
        yield put(A.fetchQuotationSuccess(prop('success', data)))
      }
    } catch (e) {
      yield put(A.fetchQuotationFailure(e.message))
    }
  }

  return function * () {
    yield takeLatest(AT.FETCH_BTC_ETH, fetchBtcEth)
    yield takeLatest(AT.FETCH_ETH_BTC, fetchEthBtc)
    yield takeLatest(AT.FETCH_TRADE_STATUS, fetchTradeStatus)
    yield takeLatest(AT.FETCH_SHAPESHIFT_ORDER, fetchOrder)
    yield takeLatest(AT.FETCH_SHAPESHIFT_QUOTATION, fetchQuotation)
    // yield fork(watchShapeshiftQuotation)
  }
}

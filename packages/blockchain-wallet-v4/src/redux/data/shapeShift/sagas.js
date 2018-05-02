import { call, put } from 'redux-saga/effects'
import { has, prop } from 'ramda'
import * as AT from './actionTypes'
import * as A from './actions'

export default ({ api } = {}) => {
  const fetchTradeStatus = function * (address) {
    return yield call(api.getTradeStatus, address)
  }

  const fetchPair = function * (action) {
    const { pair } = action.payload
    try {
      yield put(A.fetchPairLoading(pair))
      const data = yield call(api.getPair, pair)
      yield put(A.fetchPairSuccess(pair, data))
    } catch (e) {
      yield put(A.fetchPairFailure(pair, e.message))
    }
  }

  const fetchOrder = function * (action) {
    try {
      const { depositAmount, pair, returnAddress, withdrawal } = action.payload
      yield put(A.fetchOrderLoading())
      const data = yield call(api.createOrder, depositAmount, pair, returnAddress, withdrawal)
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

  return {
    fetchTradeStatus,
    fetchPair,
    fetchOrder,
    fetchQuotation
  }
}

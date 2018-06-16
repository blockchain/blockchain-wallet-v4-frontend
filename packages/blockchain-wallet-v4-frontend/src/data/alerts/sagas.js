import { delay } from 'redux-saga'
import { call, put } from 'redux-saga/effects'
import * as actions from './actions.js'
import * as C from 'services/AlertService'

const DISMISS_AFTER = 7000

export const handleTimer = function * (action) {
  const { id } = action.payload
  yield call(delay, DISMISS_AFTER)
  yield put(actions.dismissAlert(id))
}

export const bitcoinPaymentReceived = function * (action) {
  yield put(actions.displaySuccess(C.RECEIVE_BTC_SUCCESS))
}
export const bchPaymentReceived = function * (action) {
  yield put(actions.displaySuccess(C.RECEIVE_BCH_SUCCESS))
}
export const ethereumPaymentReceived = function * (action) {
  yield put(actions.displaySuccess(C.RECEIVE_ETH_SUCCESS))
}

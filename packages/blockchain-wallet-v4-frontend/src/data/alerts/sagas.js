import { delay } from 'redux-saga'
import { takeEvery, call, put } from 'redux-saga/effects'

import * as AT from '../actionTypes'
import * as actions from './actions.js'

const DISMISS_AFTER = 7000

const handleTimer = function * (action) {
  const { id } = action.payload
  yield call(delay, DISMISS_AFTER)
  yield put(actions.dismissAlert(id))
}

const paymentReceived = function * (action) {
  yield put(actions.displaySuccess(action.message))
}

function * sagas () {
  yield takeEvery(AT.alerts.ALERTS_SHOW, handleTimer)
  yield takeEvery(AT.core.webSocket.bitcoin.PAYMENT_RECEIVED, paymentReceived)
}

export default sagas

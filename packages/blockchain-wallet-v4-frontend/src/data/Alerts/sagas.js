import { delay } from 'redux-saga'
import { takeEvery, call, put } from 'redux-saga/effects'

import * as AT from './actionTypes'
import * as actions from '../actions.js'

const DISMISS_AFTER = 7000

const handleTimer = function * (action) {
  const { id } = action.payload
  yield call(delay, DISMISS_AFTER)
  yield put(actions.alerts.dismissAlert(id))
}

function * sagas () {
  yield takeEvery(AT.ALERTS_SHOW, handleTimer)
}

export default sagas

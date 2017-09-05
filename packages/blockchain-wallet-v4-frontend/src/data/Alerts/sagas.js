import { takeEvery, delay } from 'redux-saga'
import { call, put } from 'redux-saga/effects'

import * as AT from './actionTypes'
import { actions } from 'data'

export const handleTimer = function * (action) {
  const { id, time } = action.payload
  if (time && time > 0) {
    yield call(delay, time)
    yield put(actions.alerts.dismissAlert(id))
  }
}

function * sagas () {
  yield takeEvery(AT.ALERTS_SHOW, handleTimer)
}

export default sagas

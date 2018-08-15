import { delay } from 'redux-saga'
import { call, put } from 'redux-saga/effects'
import * as actions from './actions.js'

const DISMISS_AFTER = 7000

export const handleTimer = function*(action) {
  const { id, persist } = action.payload
  if (persist) return
  yield call(delay, DISMISS_AFTER)
  yield put(actions.dismissAlert(id))
}

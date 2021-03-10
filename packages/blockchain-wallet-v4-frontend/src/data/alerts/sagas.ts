import { delay, put } from 'redux-saga/effects'

import * as actions from './actions'

export const handleTimer = function * (action) {
  const { id, persist, timeout } = action.payload
  const DISMISS_ALERT = timeout || 7000
  if (persist) return
  yield delay(DISMISS_ALERT)
  yield put(actions.dismissAlert(id))
}

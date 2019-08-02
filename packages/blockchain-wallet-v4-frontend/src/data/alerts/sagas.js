import { delay, put } from 'redux-saga/effects'
import * as actions from './actions'

// TODO JJ: delete all of this
const DISMISS_AFTER = 7000

export const handleTimer = function*(action) {
  const { id, persist } = action.payload
  if (persist) return
  yield delay(DISMISS_AFTER)
  yield put(actions.dismissAlert(id))
}

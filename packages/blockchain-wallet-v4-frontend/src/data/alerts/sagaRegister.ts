import { takeEvery } from 'redux-saga/effects'

import * as sagas from './sagas'
import { showAlerts } from './slice'

export default function* alertsSaga() {
  yield takeEvery(showAlerts.type, sagas.handleTimer)
}

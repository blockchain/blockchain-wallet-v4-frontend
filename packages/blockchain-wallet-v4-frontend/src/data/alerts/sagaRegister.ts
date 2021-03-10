import { takeEvery } from 'redux-saga/effects'

import * as actionTypes from '../actionTypes'
import * as sagas from './sagas'

export default function * alertsSaga() {
  yield takeEvery(actionTypes.alerts.ALERTS_SHOW, sagas.handleTimer)
}

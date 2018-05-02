import { takeEvery } from 'redux-saga/effects'
import * as AT from './actionTypes'
import * as sagas from './sagas'

export default function * () {
  yield takeEvery(AT.ALERTS_SHOW, sagas.handleTimer)
}

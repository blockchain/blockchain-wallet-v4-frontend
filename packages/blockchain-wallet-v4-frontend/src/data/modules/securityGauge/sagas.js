import { call, put, takeEvery } from 'redux-saga/effects'
import * as AT from './actionTypes'
import * as actions from '../../actions.js'
import * as sagas from '../../sagas.js'

const init = function * (action) {
  try {
    yield call(sagas.core.settings.fetchSettings)
  } catch (e) {
    yield put(actions.alerts.displayError('Could not init security gauge.'))
  }
}

export default function * () {
  yield takeEvery(AT.INIT_SECURITY_GAUGE, init)
}

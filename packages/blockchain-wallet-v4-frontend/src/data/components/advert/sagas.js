import { takeEvery, put, call } from 'redux-saga/effects'
import * as AT from './actionTypes'
import * as actions from '../../actions.js'
import * as sagas from '../../sagas.js'

export const init = function * (action) {
  try {
    yield call(sagas.core.data.misc.fetchAdverts, action.payload)
  } catch (e) {
    yield put(actions.alerts.displayError('Could not init advert.'))
  }
}

export default function * () {
  yield takeEvery(AT.INIT_ADVERT, init)
}

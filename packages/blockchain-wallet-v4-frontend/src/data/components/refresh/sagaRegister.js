import * as AT from './actionTypes'
import { takeLatest } from 'redux-saga/effects'
import sagas from './sagas'

export default () => {
  const refreshSagas = sagas()

  return function * refreshSaga () {
    yield takeLatest(AT.REFRESH_CLICKED, refreshSagas.refreshClicked)
  }
}

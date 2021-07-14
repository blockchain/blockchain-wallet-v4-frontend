import { takeLatest } from 'redux-saga/effects'

import * as AT from './actionTypes'
import sagas from './sagas'

export default () => {
  const refreshSagas = sagas()

  return function* refreshSaga() {
    yield takeLatest(AT.REFRESH_CLICKED, refreshSagas.refreshClicked)
    yield takeLatest(AT.REFRESH_RATES, refreshSagas.refreshRates)
  }
}

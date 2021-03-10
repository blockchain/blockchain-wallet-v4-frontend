import { takeLatest } from 'redux-saga/effects'

import * as AT from './actionTypes'
import sagas from './sagas'

export default () => {
  const preferencesSagas = sagas()

  return function * preferencesSaga() {
    yield takeLatest(AT.SET_LANGUAGE, preferencesSagas.setLanguage)
  }
}

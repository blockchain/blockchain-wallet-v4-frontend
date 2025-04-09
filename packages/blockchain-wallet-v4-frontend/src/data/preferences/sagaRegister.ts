import { takeLatest } from 'redux-saga/effects'

import sagas from './sagas'
import { actions } from './slice'

export default () => {
  const preferencesSagas = sagas()

  return function* preferencesSaga() {
    yield takeLatest(actions.setLanguage, preferencesSagas.setLanguage)
  }
}

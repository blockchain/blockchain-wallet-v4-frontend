import { takeLatest } from 'redux-saga/effects'

import { actions } from './slice'
import sagas from './sagas'

export default () => {
  const preferencesSagas = sagas()

  return function* preferencesSaga() {
    yield takeLatest(actions.setLanguage, preferencesSagas.setLanguage)
  }
}

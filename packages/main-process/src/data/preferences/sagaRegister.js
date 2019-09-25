import { takeLatest } from 'redux-saga/effects'
import * as AT from './actionTypes'
import sagas from './sagas'

export default ({ imports }) => {
  const preferencesSagas = sagas({ imports })

  return function * preferencesSaga () {
    yield takeLatest(AT.SET_LANGUAGE, preferencesSagas.setLanguage)
  }
}

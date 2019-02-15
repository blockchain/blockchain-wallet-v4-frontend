import { takeEvery } from 'redux-saga/effects'
import * as AT from './actionTypes'
import sagas from './sagas'

export default () => {
  const loginSagas = sagas()

  return function* loginSaga () {
    yield takeEvery(AT.LOGIN_INITIALIZED, loginSagas.initialized)
  }
}

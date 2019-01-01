import { takeLatest } from 'redux-saga/effects'
import * as AT from './actionTypes'
import sagas from './sagas'

export default ({ api, coreSagas }) => {
  const { signIn, clearSession, fetchUser } = sagas({
    api,
    coreSagas
  })

  return function* profileSaga () {
    yield takeLatest(AT.SIGN_IN, signIn)
    yield takeLatest(AT.CLEAR_SESSION, clearSession)
    yield takeLatest(AT.FETCH_USER, fetchUser)
  }
}

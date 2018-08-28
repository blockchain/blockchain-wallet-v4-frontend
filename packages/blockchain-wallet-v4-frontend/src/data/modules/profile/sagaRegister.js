import { takeLatest } from 'redux-saga/effects'
import * as AT from './actionTypes'
import sagas from './sagas'

export default ({ api, coreSagas }) => {
  const { signIn, clearSession, generateAuthCredentials } = sagas({
    api,
    coreSagas
  })

  return function*() {
    yield takeLatest(AT.SIGN_IN, signIn)
    yield takeLatest(AT.CLEAR_SESSION, clearSession)
    yield takeLatest(AT.GENERATE_AUTH_CREDENTIALS, generateAuthCredentials)
  }
}

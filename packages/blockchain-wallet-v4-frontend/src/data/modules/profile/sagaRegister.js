import { takeLatest } from 'redux-saga/effects'
import * as AT from './actionTypes'
import sagas from './sagas'

export default ({ api, coreSagas }) => {
  const {
    clearSession,
    fetchUser,
    linkAccount,
    shareAddresses,
    signIn
  } = sagas({
    api,
    coreSagas
  })

  return function * profileSaga () {
    yield takeLatest(AT.SIGN_IN, signIn)
    yield takeLatest(AT.CLEAR_SESSION, clearSession)
    yield takeLatest(AT.FETCH_USER, fetchUser)
    yield takeLatest(AT.LINK_ACCOUNT, linkAccount)
    yield takeLatest(AT.SHARE_ADDRESSES, shareAddresses)
  }
}

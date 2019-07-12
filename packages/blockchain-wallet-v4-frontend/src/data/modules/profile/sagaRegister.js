import { takeLatest } from 'redux-saga/effects'
import * as AT from './actionTypes'
import sagas from './sagas'

export default ({ api, coreSagas, networks }) => {
  const {
    clearSession,
    createLinkAccountId,
    fetchUser,
    linkFromPitAccount,
    linkToPitAccount,
    shareAddresses,
    signIn
  } = sagas({
    api,
    coreSagas,
    networks
  })

  return function * profileSaga () {
    yield takeLatest(AT.SIGN_IN, signIn)
    yield takeLatest(AT.CLEAR_SESSION, clearSession)
    yield takeLatest(AT.FETCH_USER, fetchUser)
    yield takeLatest(AT.LINK_FROM_PIT_ACCOUNT, linkFromPitAccount)
    yield takeLatest(AT.LINK_TO_PIT_ACCOUNT, linkToPitAccount)
    yield takeLatest(AT.CREATE_LINK_ACCOUNT_ID, createLinkAccountId)
    yield takeLatest(AT.SHARE_ADDRESSES, shareAddresses)
  }
}

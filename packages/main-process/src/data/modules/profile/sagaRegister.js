import { takeLatest } from 'redux-saga/effects'
import * as AT from './actionTypes'
import sagas from './sagas'

export default ({ api, coreSagas, networks }) => {
  const {
    clearSession,
    fetchUser,
    linkFromPitAccount,
    linkToPitAccount,
    shareWalletAddressesWithPit,
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
    yield takeLatest(
      AT.SHARE_WALLET_ADDRESSES_WITH_PIT,
      shareWalletAddressesWithPit
    )
  }
}

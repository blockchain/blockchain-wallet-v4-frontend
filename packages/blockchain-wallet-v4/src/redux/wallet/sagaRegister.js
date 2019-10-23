import { takeLatest } from 'redux-saga/effects'
import * as AT from './actionTypes'
import sagas from './sagas.ts'

export default rest => {
  const walletSagas = sagas(rest)

  return function * coreWalletSaga () {
    yield takeLatest(AT.SET_DEFAULT_ACCOUNT, walletSagas.refetchContextData)
    yield takeLatest(AT.SET_ADDRESS_ARCHIVED, walletSagas.refetchContextData)
    yield takeLatest(AT.SET_ACCOUNT_ARCHIVED, walletSagas.refetchContextData)
    yield takeLatest(AT.SET_HD_ADDRESS_LABEL, walletSagas.setHDAddressLabel)
  }
}

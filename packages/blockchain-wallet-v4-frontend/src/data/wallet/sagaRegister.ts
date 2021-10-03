import { takeEvery, takeLatest } from 'redux-saga/effects'

import * as AT from './actionTypes'
import sagas from './sagas'

export default ({ coreSagas }) => {
  const walletSagas = sagas({ coreSagas })

  return function* walletSaga() {
    yield takeEvery(AT.TOGGLE_SECOND_PASSWORD, walletSagas.toggleSecondPassword)
    yield takeEvery(AT.UPDATE_PBKDF2_ITERATIONS, walletSagas.updatePbkdf2Iterations)
    yield takeEvery(AT.VERIFY_MNEMONIC, walletSagas.verifyMnemonic)
    yield takeEvery(AT.EDIT_BTC_ACCOUNT_LABEL, walletSagas.editBtcAccountLabel)
    yield takeLatest(AT.SET_MAIN_PASSWORD, walletSagas.setMainPassword)
  }
}

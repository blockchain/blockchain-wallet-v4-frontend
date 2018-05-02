import { takeEvery, call, put } from 'redux-saga/effects'
import * as AT from './actionTypes'
import * as actions from '../actions.js'
import { askSecondPasswordEnhancer, promptForInput } from 'services/SagaService'
import sagas from './sagas'

export default ({ coreSagas }) => {
  const walletSagas = sagas({ coreSagas })

  return function* () {
    yield takeEvery(AT.TOGGLE_SECOND_PASSWORD, walletSagas.toggleSecondPassword)
    yield takeEvery(AT.UPDATE_PBKDF2_ITERATIONS, walletSagas.updatePbkdf2Iterations)
    yield takeEvery(AT.VERIFY_MNEMONIC, walletSagas.verifyMmenonic)
    yield takeEvery(AT.EDIT_HD_LABEL, walletSagas.editHdLabel)
    yield takeEvery(AT.EDIT_BTC_ACCOUNT_LABEL, walletSagas.editBtcAccountLabel)
  }
}

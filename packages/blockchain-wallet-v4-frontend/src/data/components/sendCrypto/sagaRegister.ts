import { takeEvery, takeLatest } from 'redux-saga/effects'

import { actionTypes } from 'data/form/actionTypes'

import sagas from './sagas'
import { actions as A } from './slice'

export default ({ api, coreSagas, networks }) => {
  const sendCryptoSagas = sagas({ api, coreSagas, networks })

  return function* brokerageSaga() {
    yield takeLatest(A.buildTx.type, sendCryptoSagas.buildTx)
    yield takeLatest(A.fetchWithdrawalFees.type, sendCryptoSagas.fetchFeesAndMins)
    yield takeLatest(A.fetchWithdrawalLocks.type, sendCryptoSagas.fetchLocks)
    yield takeLatest(A.submitTransaction.type, sendCryptoSagas.submitTransaction)
    yield takeLatest(A.fetchSendLimits.type, sendCryptoSagas.fetchSendLimits)
    yield takeLatest(A.validateAddress.type, sendCryptoSagas.validateAddress)
    yield takeLatest(A.initializeSend.type, sendCryptoSagas.initializeSend)
    // TODO: remove when all tokens moved to sendCrypto
    // @ts-ignore
    yield takeEvery(actionTypes.CHANGE, sendCryptoSagas.onFormChange)
  }
}

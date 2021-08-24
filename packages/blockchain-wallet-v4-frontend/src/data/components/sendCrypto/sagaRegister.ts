import { takeEvery, takeLatest } from 'redux-saga/effects'

import { actionTypes } from 'data/form/actionTypes'

import sagas from './sagas'
import { actions as A } from './slice'

export default ({ api }) => {
  const sendCryptoSagas = sagas({ api })

  return function* brokerageSaga() {
    yield takeLatest(A.fetchWithdrawalFees.type, sendCryptoSagas.fetchFees)
    yield takeLatest(A.fetchWithdrawalLocks.type, sendCryptoSagas.fetchLocks)
    yield takeLatest(A.submitTransaction.type, sendCryptoSagas.submitTransaction)
    // TODO: remove when all tokens moved to sendCrypto
    // @ts-ignore
    yield takeEvery(actionTypes.CHANGE, sendCryptoSagas.onFormChange)
  }
}

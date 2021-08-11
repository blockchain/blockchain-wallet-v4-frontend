import { takeLatest } from 'redux-saga/effects'

import sagas from './sagas'
import { actions as A } from './slice'

export default ({ api }) => {
  const sendCryptoSagas = sagas({ api })

  return function* brokerageSaga() {
    yield takeLatest(A.fetchWithdrawalFees.type, sendCryptoSagas.fetchFees)
    yield takeLatest(A.fetchWithdrawalLocks.type, sendCryptoSagas.fetchLocks)
    yield takeLatest(A.submit.type, sendCryptoSagas.submit)
  }
}

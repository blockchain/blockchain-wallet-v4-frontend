import { takeEvery, takeLatest } from 'redux-saga/effects'

import sagas from './sagas'
import { actions } from './slice'

export default ({ api }) => {
  const recurringBuySagas = sagas({ api })

  return function* recurringBuySaga() {
    yield takeLatest(actions.showModal.type, recurringBuySagas.showModal)
    // yield takeLatest(actions.fetchPaymentInfo.type, recurringBuySagas.fetchPaymentInfo)
  }
}

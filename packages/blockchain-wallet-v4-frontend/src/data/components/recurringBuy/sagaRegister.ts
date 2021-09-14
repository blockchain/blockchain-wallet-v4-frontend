import { takeEvery, takeLatest } from 'redux-saga/effects'

import sagas from './sagas'
import { actions } from './slice'

export default ({ api }) => {
  const recurringBuySagas = sagas({ api })

  return function* recurringBuySaga() {
    yield takeLatest(actions.showModal.type, recurringBuySagas.showModal)
    yield takeLatest(actions.fetchPaymentInfo.type, recurringBuySagas.fetchPaymentInfo)
    yield takeLatest(actions.fetchRegisteredList.type, recurringBuySagas.fetchRegisteredList)
    yield takeEvery(actions.createRecurringBuy.type, recurringBuySagas.createRecurringBuy)
    yield takeEvery(actions.removeRecurringBuy.type, recurringBuySagas.removeRecurringBuy)
  }
}

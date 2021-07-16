import { takeLatest } from 'redux-saga/effects'

import sagas from './sagas'
import { actions } from './slice'

export default () => {
  const recurringBuySagas = sagas()

  return function* recurringBuySaga() {
    yield takeLatest(actions.showModal.type, recurringBuySagas.showModal)
  }
}

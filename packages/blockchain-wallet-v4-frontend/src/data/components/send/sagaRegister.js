import * as AT from './actionTypes'
import { takeLatest } from 'redux-saga/effects'
import sagas from './sagas'

export default ({ api }) => {
  const sendSagas = sagas({ api })

  return function * sendSaga () {
    yield takeLatest(
      AT.FETCH_PAYMENTS_ACCOUNT_PIT,
      sendSagas.fetchPaymentsAccountPit
    )
  }
}

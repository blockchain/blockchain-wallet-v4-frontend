import * as AT from './actionTypes'
import { takeLatest } from 'redux-saga/effects'
import sagas from './sagas'

export default ({ api, coreSagas, networks }) => {
  const sendSagas = sagas({ api, coreSagas, networks })

  return function * sendSaga () {
    yield takeLatest(
      AT.FETCH_PAYMENTS_ACCOUNT_EXCHANGE,
      sendSagas.fetchPaymentsAccountExchange
    )
    yield takeLatest(
      AT.FETCH_PAYMENTS_TRADING_ACCOUNTS,
      sendSagas.fetchPaymentsTradingAccount
    )
  }
}

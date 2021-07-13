import { takeEvery, takeLatest } from 'redux-saga/effects'

import { actionTypes } from 'data/form/actionTypes'

import * as AT from './actionTypes'
import sagas from './sagas'

export default ({ api, coreSagas, networks }) => {
  const sendSagas = sagas({ api, coreSagas, networks })

  return function* sendSaga() {
    yield takeLatest(AT.FETCH_PAYMENTS_ACCOUNT_EXCHANGE, sendSagas.fetchPaymentsAccountExchange)
    yield takeLatest(AT.FETCH_PAYMENTS_TRADING_ACCOUNTS, sendSagas.fetchPaymentsTradingAccount)
    yield takeLatest(AT.FETCH_UNSTOPPABLE_DOMAIN_RESULTS, sendSagas.fetchUnstoppableDomainResults)
    yield takeLatest(
      AT.NOTIFY_NON_CUSTODIAL_TO_CUSTODIAL_TRANSFER,
      sendSagas.notifyNonCustodialToCustodialTransfer
    )
    yield takeLatest(AT.GET_LOCK_RULE, sendSagas.getWithdrawalLockCheck)
    yield takeEvery(actionTypes.CHANGE, sendSagas.formChanged)
  }
}

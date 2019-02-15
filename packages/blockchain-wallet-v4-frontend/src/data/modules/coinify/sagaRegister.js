import { takeLatest } from 'redux-saga/effects'
import * as AT from './actionTypes'
import sagas from './sagas'
import { actionTypes } from 'redux-form'

export default ({ coreSagas, networks }) => {
  const coinifySagas = sagas({ coreSagas, networks })

  return function* coinifySaga () {
    yield takeLatest(AT.SIGNUP, coinifySagas.coinifySignup)
    yield takeLatest(AT.COINIFY_SAVE_MEDIUM, coinifySagas.coinifySaveMedium)
    yield takeLatest(AT.COINIFY_BUY, coinifySagas.buy)
    yield takeLatest(AT.COINIFY_SELL, coinifySagas.sell)
    yield takeLatest(actionTypes.CHANGE, coinifySagas.handleChange)
    yield takeLatest(AT.COINIFY_INITIALIZED, coinifySagas.initialized)
    yield takeLatest(AT.COINIFY_FROM_ISX, coinifySagas.fromISX)
    yield takeLatest(AT.COINIFY_TRIGGER_KYC, coinifySagas.triggerKYC)
    yield takeLatest(AT.OPEN_KYC, coinifySagas.openKYC)
    yield takeLatest(
      AT.COINIFY_DELETE_BANK_ACCOUNT,
      coinifySagas.deleteBankAccount
    )
    yield takeLatest(AT.CANCEL_ISX, coinifySagas.cancelISX)
    yield takeLatest(AT.FINISH_TRADE, coinifySagas.finishTrade)
    yield takeLatest(AT.CANCEL_TRADE, coinifySagas.cancelTrade)
    yield takeLatest(AT.CANCEL_SUBSCRIPTION, coinifySagas.cancelSubscription)
    yield takeLatest(AT.CHECKOUT_CARD_MAX, coinifySagas.checkoutCardMax)
    yield takeLatest(
      AT.COINIFY_INITIALIZE_PAYMENT,
      coinifySagas.initializePayment
    )
  }
}

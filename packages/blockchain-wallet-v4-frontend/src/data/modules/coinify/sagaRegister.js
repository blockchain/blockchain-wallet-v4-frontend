import { takeLatest } from 'redux-saga/effects'
import * as AT from './actionTypes'
import sagas from './sagas'
import { actionTypes } from 'redux-form'

export default ({ coreSagas }) => {
  const coinifySagas = sagas({ coreSagas })

  return function * () {
    yield takeLatest(AT.SIGNUP, coinifySagas.coinifySignup)
    yield takeLatest(AT.COINIFY_SAVE_MEDIUM, coinifySagas.coinifySaveMedium)
    yield takeLatest(AT.COINIFY_BUY, coinifySagas.buy)
    yield takeLatest(AT.COINIFY_SELL, coinifySagas.sell)
    yield takeLatest(actionTypes.CHANGE, coinifySagas.handleChange)
    yield takeLatest(AT.COINIFY_INITIALIZED, coinifySagas.initialized)
    yield takeLatest(AT.COINIFY_SET_CHECKOUT_MAX, coinifySagas.setMinMax)
    yield takeLatest(AT.COINIFY_SET_CHECKOUT_MIN, coinifySagas.setMinMax)
    yield takeLatest(AT.COINIFY_FROM_ISX, coinifySagas.fromISX)
    yield takeLatest(AT.COINIFY_TRIGGER_KYC, coinifySagas.triggerKYC)
    yield takeLatest(AT.OPEN_KYC, coinifySagas.openKYC)
  }
}

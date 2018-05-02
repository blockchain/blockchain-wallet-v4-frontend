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
    yield takeLatest(actionTypes.CHANGE, coinifySagas.handleChange)
    yield takeLatest(AT.COINIFY_INITIALIZED, coinifySagas.initialized)
    // yield takeLatest(AT.COINIFY_SET_CHECKOUT_MAX, coinifySagas.setCheckoutMax)
  }
}

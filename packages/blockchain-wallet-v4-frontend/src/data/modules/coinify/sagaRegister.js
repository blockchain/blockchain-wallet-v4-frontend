import { takeLatest } from 'redux-saga/effects'
import * as AT from './actionTypes'

export default ({ coreSagas }) => {
  const coinifySagas = sagas({ coreSagas })

  return function* () {
    yield takeLatest(AT.SIGNUP, coinifySagas.coinifySignup)
    yield takeLatest(AT.COINIFY_SAVE_MEDIUM, coinifySagas.coinifySaveMedium)
    yield takeLatest(AT.COINIFY_BUY, coinifySagas.buy)
  }
}

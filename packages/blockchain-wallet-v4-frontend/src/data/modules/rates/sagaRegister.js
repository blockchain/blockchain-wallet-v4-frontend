import { takeLatest } from 'redux-saga/effects'
import * as AT from './actionTypes'
import sagasFactory from './sagas'

export default () => {
  const sagas = sagasFactory()

  return function*() {
    yield takeLatest(AT.SUBSCRIBE_TO_RATES, sagas.subscribeToRates)
    yield takeLatest(AT.UNSUBSCRIBE_FROM_RATES, sagas.unsubscribeFromRates)
  }
}

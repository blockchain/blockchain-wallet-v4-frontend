import { takeLatest } from 'redux-saga/effects'
import * as AT from './actionTypes'
import sagasFactory from './sagas'

export default ({ api }) => {
  const sagas = sagasFactory({ api })

  return function*() {
    yield takeLatest(AT.SUBSCRIBE_TO_ADVICE, sagas.subscribeToAdvice)
    yield takeLatest(AT.UNSUBSCRIBE_FROM_ADVICE, sagas.unsubscribeFromAdvice)
    yield takeLatest(AT.FETCH_AVAILABLE_PAIRS, sagas.fetchAvailablePairs)
    yield takeLatest(AT.UPDATE_ADVICE, sagas.updateAdvice)
  }
}

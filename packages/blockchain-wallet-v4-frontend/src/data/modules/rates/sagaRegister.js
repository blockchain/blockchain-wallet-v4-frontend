import { takeLatest } from 'redux-saga/effects'

import * as AT from './actionTypes'
import sagas from './sagas'

export default ({ api }) => {
  const ratesSagas = sagas({ api })

  return function * ratesSaga() {
    yield takeLatest(AT.SUBSCRIBE_TO_ADVICE, ratesSagas.subscribeToAdvice)
    yield takeLatest(
      AT.UNSUBSCRIBE_FROM_ADVICE,
      ratesSagas.unsubscribeFromAdvice
    )
    yield takeLatest(AT.FETCH_AVAILABLE_PAIRS, ratesSagas.fetchAvailablePairs)
    yield takeLatest(AT.UPDATE_ADVICE, ratesSagas.updateAdvice)
    yield takeLatest(AT.SUBSCRIBE_TO_RATES, ratesSagas.subscribeToRates)
    yield takeLatest(AT.UNSUBSCRIBE_FROM_RATES, ratesSagas.unsubscribeFromRates)
  }
}

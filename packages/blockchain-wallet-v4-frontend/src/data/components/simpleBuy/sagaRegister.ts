import * as AT from './actionTypes'
import { takeLatest } from 'redux-saga/effects'
import sagas from './sagas'

export default ({ api, coreSagas, networks }) => {
  const simpleBuySagas = sagas({ api, coreSagas, networks })

  return function * simpleBuySaga () {
    yield takeLatest(
      AT.FETCH_SB_FIAT_ELIGIBLE,
      simpleBuySagas.fetchSBFiatEligible
    )
    yield takeLatest(AT.FETCH_SB_PAIRS, simpleBuySagas.fetchSBPairs)
  }
}

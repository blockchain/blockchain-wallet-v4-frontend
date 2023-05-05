import { takeEvery, takeLatest } from 'redux-saga/effects'

import { actionTypes } from 'data'

import sagas from './sagas'
import { actions } from './slice'

export default ({ api }) => {
  const dexSagas = sagas({ api })

  return function* dexSaga() {
    yield takeEvery(actionTypes.form.CHANGE, dexSagas.fetchSwapQuoteOnChange)
    yield takeLatest(actions.fetchSwapQuote, dexSagas.fetchSwapQuote)
    yield takeLatest(actions.fetchChains.type, dexSagas.fetchChains)
    yield takeLatest(actions.fetchChainTokens.type, dexSagas.fetchChainTokens)
    yield takeLatest(actions.fetchSearchedTokens.type, dexSagas.fetchSearchedTokens)
    yield takeLatest(actions.fetchUserEligibility.type, dexSagas.fetchUserEligibility)
  }
}

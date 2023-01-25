import { takeEvery, takeLatest } from 'redux-saga/effects'

import { actionTypes } from 'data'

import sagas from './sagas'
import { actions } from './slice'

export default ({ api }) => {
  const dexSagas = sagas({ api })

  return function* dexSaga() {
    yield takeEvery(actionTypes.form.CHANGE, dexSagas.fetchSwapQuote)
    yield takeLatest(actions.fetchChains.type, dexSagas.fetchChains)
    yield takeLatest(actions.fetchUserEligibility.type, dexSagas.fetchUserEligibility)
    yield takeLatest(actions.fetchChainTokens.type, dexSagas.fetchChainTokens)
  }
}

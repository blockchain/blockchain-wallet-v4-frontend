import { Task } from 'redux-saga'
import { cancel, fork, take, takeEvery, takeLatest } from 'redux-saga/effects'

import { actionTypes } from 'data'

import sagas from './sagas'
import { actions } from './slice'

let pollTaskPrice: Task

export default ({ api }) => {
  const dexSagas = sagas({ api })

  return function* dexSaga() {
    yield takeEvery(actionTypes.form.CHANGE, dexSagas.fetchSwapQuoteOnChange)
    yield takeLatest(actions.fetchSwapQuote.type, function* () {
      if (pollTaskPrice?.isRunning()) yield cancel(pollTaskPrice)
      pollTaskPrice = yield fork(dexSagas.fetchSwapQuote)
      yield take(actions.stopPollSwapQuote)
      yield cancel(pollTaskPrice)
    })
    yield takeLatest(actions.fetchTokenAllowance.type, dexSagas.fetchTokenAllowance)
    yield takeLatest(actions.fetchChains.type, dexSagas.fetchChains)
    yield takeLatest(actions.fetchChainTokens.type, dexSagas.fetchChainTokens)
    yield takeLatest(actions.fetchSearchedTokens.type, dexSagas.fetchSearchedTokens)
    yield takeLatest(actions.fetchUserEligibility.type, dexSagas.fetchUserEligibility)
  }
}

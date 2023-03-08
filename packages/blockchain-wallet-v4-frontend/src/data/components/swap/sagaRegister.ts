import { actionTypes } from 'redux-form'
import { Task } from 'redux-saga'
import { cancel, fork, take, takeEvery, takeLatest } from 'redux-saga/effects'

import sagas from './sagas'
import { proceedToSwapConfirmation } from './sagas/proceedToSwapConfirmation'
import { returnToInitSwap } from './sagas/returnToInitSwap'
import { trackAccountsSelected } from './sagas/trackAccountsSelected'
import { actions } from './slice'

let pollTask: Task
let pollTaskPrice: Task

export default ({ api, coreSagas, networks }) => {
  const swapSagas = sagas({ api, coreSagas, networks })

  return function* swapSaga() {
    yield takeLatest(actions.cancelOrder.type, swapSagas.cancelOrder)
    yield takeLatest(actions.changeBase.type, swapSagas.changeBase)
    yield takeLatest(actions.changeCounter.type, swapSagas.changeCounter)
    yield takeLatest(actions.changeTrendingPair.type, swapSagas.changeTrendingPair)
    yield takeLatest(actions.createOrder.type, swapSagas.createOrder)
    yield takeLatest(actions.fetchCustodialEligibility.type, swapSagas.fetchCustodialEligibility)
    yield takeLatest(actions.fetchPairs.type, swapSagas.fetchPairs)
    yield takeLatest(actions.fetchLimits.type, swapSagas.fetchLimits)
    yield takeLatest(actions.fetchTrades.type, swapSagas.fetchTrades)
    yield takeLatest(actions.initAmountForm.type, swapSagas.initAmountForm)
    yield takeLatest(actions.refreshAccounts.type, swapSagas.refreshAccounts)
    yield takeLatest(actions.showModal.type, swapSagas.showModal)
    yield takeLatest(actions.switchFix.type, swapSagas.switchFix)
    yield takeLatest(actions.toggleBaseAndCounter.type, swapSagas.toggleBaseAndCounter)
    yield takeEvery(actionTypes.CHANGE, swapSagas.formChanged)
    yield takeLatest(actions.handleSwapMaxAmountClick.type, swapSagas.handleSwapMaxAmountClick)
    yield takeLatest(actions.handleSwapMinAmountClick.type, swapSagas.handleSwapMinAmountClick)
    yield takeLatest(actions.fetchCrossBorderLimits.type, swapSagas.fetchCrossBorderLimits)
    yield takeLatest(actions.proceedToSwapConfirmation.type, proceedToSwapConfirmation)
    yield takeLatest(actions.returnToInitSwap.type, returnToInitSwap)
    yield takeEvery(actions.setStep.type, trackAccountsSelected)

    yield takeLatest(
      actions.startPollQuotePrice.type,
      function* (payload: ReturnType<typeof actions.startPollQuotePrice>) {
        if (pollTaskPrice && pollTaskPrice.isRunning()) yield cancel(pollTaskPrice)
        pollTaskPrice = yield fork(swapSagas.fetchQuotePrice, payload)
        yield take(actions.stopPollQuotePrice)
        yield cancel(pollTaskPrice)
      }
    )

    yield takeLatest(
      actions.startPollQuote.type,
      function* (payload: ReturnType<typeof actions.startPollQuote>) {
        if (pollTask && pollTask.isRunning()) yield cancel(pollTask)
        pollTask = yield fork(swapSagas.fetchQuote, payload)
        yield take(actions.stopPollQuote)
        yield cancel(pollTask)
      }
    )
  }
}

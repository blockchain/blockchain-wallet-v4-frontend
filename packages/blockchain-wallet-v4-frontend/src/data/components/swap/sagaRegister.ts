import { actionTypes } from 'redux-form'
import { Task } from 'redux-saga'
import { cancel, fork, take, takeEvery, takeLatest } from 'redux-saga/effects'

import * as AT from './actionTypes'
import sagas from './sagas'

let pollTask: Task

export default ({ api, coreSagas, networks }) => {
  const swapSagas = sagas({ api, coreSagas, networks })

  return function* swapSaga() {
    yield takeLatest(AT.CANCEL_ORDER, swapSagas.cancelOrder)
    yield takeLatest(AT.CHANGE_BASE, swapSagas.changeBase)
    yield takeLatest(AT.CHANGE_COUNTER, swapSagas.changeCounter)
    yield takeLatest(AT.CHANGE_SWAP_TRENDING_PAIR, swapSagas.changeTrendingPair)
    yield takeLatest(AT.CREATE_ORDER, swapSagas.createOrder)
    yield takeLatest(AT.FETCH_CUSTODIAL_ELIGIBILITY, swapSagas.fetchCustodialEligibility)
    yield takeLatest(AT.FETCH_PAIRS, swapSagas.fetchPairs)
    yield takeLatest(AT.FETCH_LIMITS, swapSagas.fetchLimits)
    yield takeLatest(AT.FETCH_TRADES, swapSagas.fetchTrades)
    yield takeLatest(AT.INIT_AMOUNT_FORM, swapSagas.initAmountForm)
    yield takeLatest(AT.REFRESH_ACCOUNTS, swapSagas.refreshAccounts)
    yield takeLatest(AT.SHOW_MODAL, swapSagas.showModal)
    yield takeLatest(AT.SWITCH_FIX, swapSagas.switchFix)
    yield takeLatest(AT.TOGGLE_BASE_COUNTER, swapSagas.toggleBaseAndCounter)
    yield takeEvery(actionTypes.CHANGE, swapSagas.formChanged)
    yield takeLatest(AT.HANDLE_SWAP_MAX_AMOUNT_CLICK, swapSagas.handleSwapMaxAmountClick)
    yield takeLatest(AT.HANDLE_SWAP_MIN_AMOUNT_CLICK, swapSagas.handleSwapMinAmountClick)

    yield takeLatest(AT.START_POLL_QUOTE, function* () {
      if (pollTask && pollTask.isRunning) yield cancel(pollTask)
      pollTask = yield fork(swapSagas.fetchQuote)
      yield take(AT.STOP_POLL_QUOTE)
      yield cancel(pollTask)
    })
  }
}

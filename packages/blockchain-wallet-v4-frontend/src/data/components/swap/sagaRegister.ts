import { actionTypes } from 'redux-form'
import { cancel, fork, take, takeEvery, takeLatest } from 'redux-saga/effects'
import { Task } from 'redux-saga'

import * as AT from './actionTypes'
import sagas from './sagas'

let pollTask: Task

export default ({ api, coreSagas, networks }) => {
  const swapSagas = sagas({ api, coreSagas, networks })

  return function * swapSaga () {
    yield takeLatest(AT.CHANGE_PAIR, swapSagas.changePair)
    yield takeLatest(AT.CHANGE_SWAP_TRENDING_PAIR, swapSagas.changeTrendingPair)
    yield takeLatest(AT.CREATE_ORDER, swapSagas.createOrder)
    yield takeLatest(AT.FETCH_LIMITS, swapSagas.fetchLimits)
    yield takeLatest(AT.INIT_AMOUNT_FORM, swapSagas.initAmountForm)
    yield takeLatest(AT.SHOW_MODAL, swapSagas.showModal)
    yield takeLatest(AT.TOGGLE_BASE_COUNTER, swapSagas.toggleBaseAndCounter)
    yield takeEvery(actionTypes.CHANGE, swapSagas.formChanged)

    yield takeLatest(AT.START_POLL_QUOTE, function * () {
      if (pollTask && pollTask.isRunning) yield cancel(pollTask)
      pollTask = yield fork(swapSagas.fetchQuote)
      yield take(AT.STOP_POLL_QUOTE)
      yield cancel(pollTask)
    })
  }
}

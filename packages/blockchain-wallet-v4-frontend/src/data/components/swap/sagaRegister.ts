import { cancel, fork, take, takeLatest } from 'redux-saga/effects'
import { Task } from 'redux-saga'

import * as AT from './actionTypes'
import sagas from './sagas'

let pollTask: Task

export default ({ api }) => {
  const swapSagas = sagas({ api })

  return function * swapSaga () {
    yield takeLatest(AT.CHANGE_PAIR, swapSagas.changePair)
    yield takeLatest(AT.CREATE_ORDER, swapSagas.createOrder)
    yield takeLatest(AT.SHOW_MODAL, swapSagas.showModal)

    yield takeLatest(AT.START_POLL_QUOTE, function * () {
      if (pollTask && pollTask.isRunning) yield cancel(pollTask)
      pollTask = yield fork(swapSagas.fetchQuote)
      yield take(AT.STOP_POLL_QUOTE)
      yield cancel(pollTask)
    })
  }
}

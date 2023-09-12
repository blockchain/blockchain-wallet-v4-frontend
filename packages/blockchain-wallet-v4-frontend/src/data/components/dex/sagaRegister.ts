import { Task } from 'redux-saga'
import { cancel, fork, take, takeEvery, takeLatest } from 'redux-saga/effects'

import { actionTypes } from 'data'

import sagas from './sagas'
import { actions } from './slice'

let pollQuoteTask: Task
let pollTokenAllowanceTask: Task
let pollTokenAllowanceTxTask: Task

export default ({ api, coreSagas, networks }) => {
  const dexSagas = sagas({ api, coreSagas, networks })

  return function* dexSaga() {
    yield takeEvery(actionTypes.form.CHANGE, dexSagas.fetchSwapQuoteOnChange)
    yield takeLatest(actions.initiateDex.type, dexSagas.initiateDex)
    yield takeLatest(actions.fetchSwapQuote.type, function* () {
      if (pollQuoteTask?.isRunning()) yield cancel(pollQuoteTask)
      pollQuoteTask = yield fork(dexSagas.fetchSwapQuote)
      yield take(actions.stopPollSwapQuote)
      yield cancel(pollQuoteTask)
    })
    yield takeLatest(
      actions.pollTokenAllowance.type,
      function* (action: ReturnType<typeof actions.pollTokenAllowance>) {
        if (pollTokenAllowanceTask?.isRunning()) yield cancel(pollTokenAllowanceTask)
        pollTokenAllowanceTask = yield fork(dexSagas.pollTokenAllowance, action)
        yield take(actions.stopPollTokenAllowance)
        yield cancel(pollTokenAllowanceTask)
      }
    )
    yield takeLatest(
      actions.pollTokenAllowanceTx.type,
      function* (action: ReturnType<typeof actions.pollTokenAllowance>) {
        if (pollTokenAllowanceTxTask?.isRunning()) yield cancel(pollTokenAllowanceTxTask)
        pollTokenAllowanceTxTask = yield fork(dexSagas.pollTokenAllowanceTx, action)
        yield take(actions.stopPollTokenAllowanceTx)
        yield cancel(pollTokenAllowanceTxTask)
      }
    )
    yield takeLatest(actions.sendSwapQuote.type, dexSagas.sendSwapQuote)
    yield takeLatest(actions.fetchTokenAllowance.type, dexSagas.fetchTokenAllowance)
    yield takeLatest(actions.fetchChains.type, dexSagas.fetchChains)
    yield takeLatest(actions.fetchUserEligibility.type, dexSagas.fetchUserEligibility)
    yield takeLatest(actions.sendTokenAllowanceTx.type, dexSagas.sendTokenAllowanceTx)
  }
}

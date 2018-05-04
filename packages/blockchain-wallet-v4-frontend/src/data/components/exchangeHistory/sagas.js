import { cancel, call, fork, put, select, takeEvery, takeLatest } from 'redux-saga/effects'
import { delay } from 'redux-saga'
import { equals, identity, path, prop } from 'ramda'
import * as AT from './actionTypes'
import { actions, selectors } from 'data'

export default ({ api, coreSagas }) => {
  const logLocation = 'components/exchangeHistory/sagas'
  let pollingTradeStatusTask

  const updateTradeStatus = function * (depositAddress) {
    try {
      const appState = yield select(identity)
      const currentTrade = selectors.core.kvStore.shapeShift.getTrade(depositAddress, appState).getOrFail('Could not find trade.')
      const currentStatus = prop('status', currentTrade)
      if (equals('complete', currentStatus) || equals('failed', currentStatus)) {
        return
      }
      const data = yield call(api.getTradeStatus, depositAddress)
      const status = prop('status', data)
      if (!equals(status, currentStatus)) {
        yield put(actions.core.kvStore.shapeShift.updateTradeStatusMetadataShapeshift(depositAddress, status))
      }
    } catch (e) {
      yield put(actions.logs.logErrorMessage(`${logLocation} updateTradeStatus`, e))
    }
  }

  const exchangeHistoryInitialized = function * (action) {
    try {
      const { trades } = action.payload
      for (let i = 0; i < trades.length; i++) {
        const trade = trades[i]
        const depositAddress = path(['quote', 'deposit'], trade)
        const orderId = path(['quote', 'orderId'], trade)
        try {
          yield fork(updateTradeStatus, depositAddress)
        } catch (e) {
          yield put(actions.alerts.displayError(`Could not fetch trade [${orderId}] status.`))
          yield put(actions.logs.logErrorMessage(`${logLocation} exchangeHistoryInitialized`, e))
        }
      }
    } catch (e) {
      yield put(actions.alerts.displayError(`Could not fetch all trades statuses.`))
      yield put(actions.logs.logErrorMessage(`${logLocation} exchangeHistoryInitialized`, e))
    }
  }

  const startPollingTradeStatus = function * (depositAddress) {
    try {
      while (true) {
        yield call(updateTradeStatus, depositAddress)
        yield call(delay, 5000)
      }
    } catch (e) {
      yield put(actions.alerts.displayError('Unable to poll for trade status.'))
      yield put(actions.logs.logErrorMessage(`${logLocation} startPollingTradeStatus`, e))
    }
  }

  const exchangeHistoryModalInitialized = function * (action) {
    try {
      const { depositAddress } = action.payload
      pollingTradeStatusTask = yield fork(startPollingTradeStatus, depositAddress)
    } catch (e) {
      yield put(actions.logs.logErrorMessage(`${logLocation} exchangeHistoryModalInitialized`, e))
    }
  }

  const exchangeHistoryModalDestroyed = function * () {
    try {
      yield cancel(pollingTradeStatusTask)
    } catch (e) {
      yield put(actions.logs.logErrorMessage(`${logLocation} exchangeHistoryModalDestroyed`, e))
    }
  }

  return function * () {
    yield takeEvery(AT.EXCHANGE_HISTORY_INITIALIZED, exchangeHistoryInitialized)
    yield takeLatest(AT.EXCHANGE_HISTORY_MODAL_INITIALIZED, exchangeHistoryModalInitialized)
    yield takeLatest(AT.EXCHANGE_HISTORY_MODAL_DESTROYED, exchangeHistoryModalDestroyed)
  }
}

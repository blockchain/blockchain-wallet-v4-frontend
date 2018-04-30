import { cancel, cancelled, call, fork, put, select, takeEvery, takeLatest } from 'redux-saga/effects'
import { delay } from 'redux-saga'
import { equals, identity, path, prop } from 'ramda'
import * as AT from './actionTypes'
import { actions, selectors } from 'data'

export default ({ api, coreSagas }) => {
  // const fetchTradeDetails = function * (action) {
  //   try {
  //     const trade = action.payload
  //     const depositAddress = path(['quote', 'deposit'], trade)
  //     yield call(coreSagas.kvStore.shapeShift.fetchShapeshiftTrade, depositAddress)
  //   } catch (e) {
  //     yield put(actions.alerts.displayError('Error fetching trade information'))
  //   }
  // }

  const exchangeHistoryInitialized = function * (trades) {
    try {
      // const { trades } = action.payload
      // for (let i = 0; i < trades.length; i++) {
      //   const { status, deposit } = trade
      //   if (prop('status', trade))
      //   yield
      // }
    } catch (e) {

    }
  }

  let pollingTradeStatusTask

  const startPollingTradeStatus = function * (depositAddress) {
    try {
      while (true) {
        console.log('startPollingTradeStatus', depositAddress)
        const appState = yield select(identity)
        const currentTrade = selectors.core.kvStore.shapeShift.getTrade(depositAddress, appState).getOrFail('Could not find trade.')
        console.log('currentTrade', currentTrade)
        const currentStatus = prop('status', currentTrade)
        console.log('currentStatus', currentStatus)
        if (equals('complete', currentStatus) || equals('failed', currentStatus)) {
          console.log('break')
          break
        }
        const data = yield call(api.getTradeStatus, depositAddress)
        console.log('data', data)
        const shapeshiftStatus = prop('status', data)
        console.log('shapeshiftStatus', shapeshiftStatus)
        if (!equals(shapeshiftStatus, currentStatus)) {
          yield put(actions.core.kvStore.shapeShift.updateTradeStatusMetadataShapeshift(depositAddress, shapeshiftStatus))
        }
        yield call(delay, 5000)
      }
    } catch (e) {
      console.log(e)
      yield put(actions.alerts.displayError('Could not refresh trade status.'))
    } finally {
      if (yield cancelled()) { console.log('cancelled') }
    }
  }

  const exchangeHistoryModalInitialized = function * (action) {
    try {
      const { depositAddress } = action.payload
      console.log('exchangeHistoryModalInitialized', depositAddress)
      pollingTradeStatusTask = yield fork(startPollingTradeStatus, depositAddress)
    } catch (e) {
      yield put(actions.alerts.displayError('Error fetching trade information'))
    }
  }

  const exchangeHistoryModalDestroyed = function * (action) {
    try {
      yield cancel(pollingTradeStatusTask)
    } catch (e) {
      yield put(actions.alerts.displayError('Error fetching trade information'))
    }
  }

  return function * () {
    yield takeEvery(AT.EXCHANGE_HISTORY_INITIALIZED, exchangeHistoryInitialized)
    yield takeLatest(AT.EXCHANGE_HISTORY_MODAL_INITIALIZED, exchangeHistoryModalInitialized)
    yield takeLatest(AT.EXCHANGE_HISTORY_MODAL_DESTROYED, exchangeHistoryModalDestroyed)
  }
}

import { cancel, call, fork, put, all, select } from 'redux-saga/effects'
import { delay } from 'redux-saga'
import {
  any,
  concat,
  equals,
  identity,
  isNil,
  last,
  map,
  path,
  prop
} from 'ramda'
import { actions, selectors } from 'data'
import * as A from './actions'
import * as S from './selectors'
import * as C from 'services/AlertService'
import { PER_PAGE } from './model'

export default ({ api, coreSagas }) => {
  const logLocation = 'components/exchangeHistory/sagas'
  let pollingTradeStatusTask = null
  let fetchingTradesTasks = []

  const updateTrade = function*(depositAddress) {
    try {
      const appState = yield select(identity)
      const currentTrade = selectors.core.kvStore.shapeShift
        .getTrade(depositAddress, appState)
        .getOrFail('Could not find trade.')
      const currentStatus = prop('status', currentTrade)
      if (
        equals('complete', currentStatus) ||
        equals('failed', currentStatus)
      ) {
        return
      }
      const data = yield call(api.getTradeStatus, depositAddress)
      const status = prop('status', data)
      const hashOut = prop('transaction', data)
      if (!equals(status, currentStatus)) {
        yield put(
          actions.core.kvStore.shapeShift.updateTradeMetadataShapeshift(
            depositAddress,
            status,
            hashOut
          )
        )
      }
    } catch (e) {
      yield put(actions.logs.logErrorMessage(logLocation, 'updateTrade', e))
    }
  }

  const fetchNextPage = function*() {
    try {
      yield put(A.fetchTradesLoading())
      const trades = (yield select(S.getTrades)).getOrElse([])
      const lastTradeTime = prop('createdAt', last(trades))
      let nextPageTrades = yield call(api.fetchTrades, PER_PAGE, lastTradeTime)
      if (nextPageTrades.length < PER_PAGE) {
        const shapeShiftTrades = (yield select(
          selectors.core.kvStore.shapeShift.getTrades
        )).getOrElse([])
        yield put(A.allFetched())
        nextPageTrades = concat(nextPageTrades, shapeShiftTrades)
      }
      yield put(A.fetchTradesSuccess(concat(trades, nextPageTrades)))
    } catch (e) {
      yield put(actions.logs.logErrorMessage(logLocation, 'fetchNextPage', e))
      yield put(A.fetchTradesError(e))
    }
  }

  const fetchTradeData = function*(trade) {
    try {
      const depositAddress = path(['quote', 'deposit'], trade)
      const status = prop('status', trade)
      const quote = prop('quote', trade)
      const depositAmount = prop('depositAmount', quote)
      const withdrawalAmount = prop('withdrawalAmount', quote)
      if (
        !equals('complete', status) ||
        any(isNil)([depositAmount, withdrawalAmount])
      ) {
        yield call(
          coreSagas.kvStore.shapeShift.fetchShapeshiftTrade,
          depositAddress
        )
      }
    } catch (e) {
      yield put(actions.alerts.displayError(C.EXCHANGE_REFRESH_TRADE_ERROR))
      yield put(actions.logs.logErrorMessage(logLocation, 'fetchTradeData', e))
    }
  }

  const exchangeHistoryInitialized = function*() {
    try {
      const trades = yield select(selectors.core.kvStore.shapeShift.getTrades)
      fetchingTradesTasks = yield all(
        trades.map(trade => fork(fetchTradeData, trade))
      )
    } catch (e) {
      yield put(actions.alerts.displayError(C.EXCHANGE_REFRESH_TRADES_ERROR))
      yield put(
        actions.logs.logErrorMessage(
          logLocation,
          'exchangeHistoryInitialized',
          e
        )
      )
    }
  }

  const exchangeHistoryDestroyed = function*() {
    try {
      yield all(map(cancel, fetchingTradesTasks))
      fetchingTradesTasks = []
    } catch (e) {
      yield put(
        actions.logs.logErrorMessage(logLocation, 'exchangeHistoryDestroyed', e)
      )
    }
  }

  const startPollingTradeStatus = function*(depositAddress) {
    try {
      while (true) {
        yield call(updateTrade, depositAddress)
        yield call(delay, 5000)
      }
    } catch (e) {
      yield put(actions.alerts.displayError(C.EXCHANGE_REFRESH_TRADE_ERROR))
      yield put(
        actions.logs.logErrorMessage(logLocation, 'startPollingTradeStatus', e)
      )
    }
  }

  const exchangeHistoryModalInitialized = function*(action) {
    try {
      const { depositAddress } = action.payload
      pollingTradeStatusTask = yield fork(
        startPollingTradeStatus,
        depositAddress
      )
    } catch (e) {
      yield put(
        actions.logs.logErrorMessage(
          logLocation,
          'exchangeHistoryModalInitialized',
          e
        )
      )
    }
  }

  const exchangeHistoryModalDestroyed = function*() {
    try {
      if (pollingTradeStatusTask) {
        yield cancel(pollingTradeStatusTask)
        pollingTradeStatusTask = null
      }
    } catch (e) {
      yield put(
        actions.logs.logErrorMessage(
          logLocation,
          'exchangeHistoryModalDestroyed',
          e
        )
      )
    }
  }

  return {
    exchangeHistoryInitialized,
    exchangeHistoryDestroyed,
    exchangeHistoryModalInitialized,
    exchangeHistoryModalDestroyed,
    fetchNextPage
  }
}

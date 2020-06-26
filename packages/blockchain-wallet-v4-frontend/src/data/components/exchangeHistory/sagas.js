import * as A from './actions'
import * as C from 'services/AlertService'
import * as S from './selectors'
import { actions, selectors } from 'data'
import {
  all,
  call,
  cancel,
  delay,
  fork,
  put,
  select,
  spawn
} from 'redux-saga/effects'
import {
  any,
  compose,
  concat,
  equals,
  identity,
  includes,
  indexBy,
  isEmpty,
  isNil,
  last,
  map,
  path,
  prop
} from 'ramda'
import { INCOMPLETE_STATES, PER_PAGE } from './model'

export const pollTimeout = 5000
export default ({ api, coreSagas }) => {
  const logLocation = 'components/exchangeHistory/sagas'
  let pollingShapeShiftTask = null
  let fetchingTradesTasks = []
  let pollingExchangeTask = null

  const updateTrade = function * (depositAddress) {
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

  const updateExchangeTrade = function * (trade) {
    try {
      const id = prop('id', trade)
      const tradeData = yield call(api.fetchTrade, id)
      yield put(A.updateTrade(id, tradeData))
    } catch (e) {
      yield put(
        actions.logs.logErrorMessage(logLocation, 'updateExchangeTrade', e)
      )
    }
  }

  const pollExchangeTrades = function * (trades) {
    try {
      while (true) {
        yield all(map(trade => fork(updateExchangeTrade, trade), trades))
        yield delay(pollTimeout)
      }
    } catch (e) {
      yield put(
        actions.logs.logErrorMessage(logLocation, 'pollExchangeTrades', e)
      )
    }
  }

  const initTradePolling = function * (trades) {
    const incompleteTrades = trades.filter(({ state }) =>
      includes(state, INCOMPLETE_STATES)
    )
    yield call(stopPollingTrades)
    if (!isEmpty(incompleteTrades)) {
      pollingExchangeTask = yield spawn(pollExchangeTrades, incompleteTrades)
    }
  }

  const stopPollingTrades = function * () {
    if (pollingExchangeTask) {
      yield cancel(pollingExchangeTask)
      pollingExchangeTask = null
    }
  }

  const fetchNextPage = function * () {
    try {
      yield put(A.fetchTradesLoading())
      const currency = (yield select(
        selectors.core.settings.getCurrency
      )).getOrElse('USD')
      const trades = (yield select(S.getTrades)).getOrElse([])
      const lastTradeTime = prop('createdAt', last(trades))
      let nextPageTrades = yield call(
        api.fetchTrades,
        PER_PAGE,
        currency,
        lastTradeTime
      )
      if (nextPageTrades.length < PER_PAGE) {
        const shapeShiftTrades = (yield select(
          selectors.core.kvStore.shapeShift.getTrades
        )).getOrElse([])
        yield put(A.allFetched())
        nextPageTrades = concat(nextPageTrades, shapeShiftTrades)
      }
      const newTrades = concat(trades, nextPageTrades)
      yield call(initTradePolling, newTrades)
      yield put(A.fetchTradesSuccess(newTrades))
    } catch (e) {
      yield put(actions.logs.logErrorMessage(logLocation, 'fetchNextPage', e))
      yield put(A.fetchTradesError(e))
    }
  }

  const updateDisplayedShapeShiftTrades = function * (updatedShapeShiftTrades) {
    if (isEmpty(updatedShapeShiftTrades)) return
    const idPath = path(['quote', 'orderId'])
    const indexedTrades = indexBy(idPath, updatedShapeShiftTrades)
    const trades = (yield select(S.getTrades)).getOrElse([])
    yield compose(
      put,
      A.fetchTradesSuccess,
      map(trade => {
        const updatedTrade = prop(idPath(trade), indexedTrades)
        if (updatedTrade) return updatedTrade
        return trade
      })
    )(trades)
  }

  const fetchTradeData = function * (trade) {
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
        return (yield select(
          selectors.core.kvStore.shapeShift.getTrade(depositAddress)
        )).getOrElse(null)
      }
      return null
    } catch (e) {
      yield put(actions.alerts.displayError(C.EXCHANGE_REFRESH_TRADE_ERROR))
      yield put(actions.logs.logErrorMessage(logLocation, 'fetchTradeData', e))
    }
  }

  const exchangeHistoryInitialized = function * () {
    try {
      const userFlowSupported = yield select(
        selectors.modules.profile.userFlowSupported
      )
      const trades = (yield select(
        selectors.core.kvStore.shapeShift.getTrades
      )).getOrElse([])
      const updatedTrades = (yield all(
        trades.map(trade => call(fetchTradeData, trade))
      )).filter(Boolean)
      if (userFlowSupported) {
        yield call(updateDisplayedShapeShiftTrades, updatedTrades)
      }
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

  const exchangeHistoryDestroyed = function * () {
    try {
      yield all(map(cancel, fetchingTradesTasks))
      fetchingTradesTasks = []
    } catch (e) {
      yield put(
        actions.logs.logErrorMessage(logLocation, 'exchangeHistoryDestroyed', e)
      )
    }
  }

  const exchangeHistoryDownload = function * () {
    try {
      const { isQueued } = yield call(api.requestTradeHistory)
      if (isQueued) {
        yield put(
          actions.alerts.displaySuccess(C.EXCHANGE_HISTORY_DOWNLOAD_SUCCESS)
        )
      } else {
        yield put(
          actions.alerts.displayError(C.EXCHANGE_HISTORY_DOWNLOAD_BLOCKED)
        )
      }
    } catch (e) {
      yield put(actions.alerts.displayError(C.EXCHANGE_HISTORY_DOWNLOAD_ERROR))
      yield put(
        actions.logs.logErrorMessage(logLocation, 'exchangeHistoryExport', e)
      )
    }
  }

  const startPollingTradeStatus = function * (depositAddress) {
    try {
      while (true) {
        yield call(updateTrade, depositAddress)
        yield delay(pollTimeout)
      }
    } catch (e) {
      yield put(actions.alerts.displayError(C.EXCHANGE_REFRESH_TRADE_ERROR))
      yield put(
        actions.logs.logErrorMessage(logLocation, 'startPollingTradeStatus', e)
      )
    }
  }

  const exchangeHistoryModalInitialized = function * (action) {
    try {
      const { depositAddress } = action.payload
      pollingShapeShiftTask = yield fork(
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

  const exchangeHistoryModalDestroyed = function * () {
    try {
      if (pollingShapeShiftTask) {
        yield cancel(pollingShapeShiftTask)
        pollingShapeShiftTask = null
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
    exchangeHistoryDestroyed,
    exchangeHistoryDownload,
    exchangeHistoryInitialized,
    exchangeHistoryModalInitialized,
    exchangeHistoryModalDestroyed,
    fetchNextPage,
    stopPollingTrades
  }
}

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
import { concat, includes, isEmpty, last, map, prop } from 'ramda'
import { INCOMPLETE_STATES, PER_PAGE } from './model'

export const pollTimeout = 5000
export default ({ api }) => {
  const logLocation = 'components/exchangeHistory/sagas'
  let fetchingTradesTasks = []
  let pollingExchangeTask = null

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
      // @ts-ignore
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
      // @ts-ignore
      const lastTradeTime = prop('createdAt', last(trades))
      let nextPageTrades = yield call(
        api.fetchTrades,
        PER_PAGE,
        currency,
        lastTradeTime
      )
      if (nextPageTrades.length < PER_PAGE) {
        yield put(A.allFetched())
      }
      const newTrades = concat(trades, nextPageTrades)
      yield call(initTradePolling, newTrades)
      yield put(A.fetchTradesSuccess(newTrades))
    } catch (e) {
      yield put(actions.logs.logErrorMessage(logLocation, 'fetchNextPage', e))
      yield put(A.fetchTradesError(e))
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

  return {
    exchangeHistoryDestroyed,
    exchangeHistoryDownload,
    fetchNextPage,
    stopPollingTrades
  }
}

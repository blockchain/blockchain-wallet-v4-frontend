import * as AT from './actionTypes'

export const initialized = () => ({
  type: AT.EXCHANGE_HISTORY_INITIALIZED
})
export const destroyed = () => ({ type: AT.EXCHANGE_HISTORY_DESTROYED })
export const modalInitialized = depositAddress => ({
  type: AT.EXCHANGE_HISTORY_MODAL_INITIALIZED,
  payload: { depositAddress }
})
export const modalDestroyed = () => ({
  type: AT.EXCHANGE_HISTORY_MODAL_DESTROYED
})

export const fetchNextPage = () => ({
  type: AT.FETCH_NEXT_PAGE
})
export const fetchTradesSuccess = trades => ({
  type: AT.FETCH_TRADES_SUCCESS,
  payload: { trades }
})
export const fetchTradesError = error => ({
  type: AT.FETCH_TRADES_ERROR,
  payload: { error }
})
export const fetchTradesLoading = () => ({
  type: AT.FETCH_TRADES_LOADING
})
export const allFetched = () => ({
  type: AT.ALL_FETCHED
})
export const clearTrades = () => ({
  type: AT.CLEAR_TRADES
})
export const updateTrade = (id, trade) => ({
  type: AT.UPDATE_TRADE,
  payload: { id, trade }
})
export const stopPollingTrades = () => ({
  type: AT.STOP_POLLING_TRADES
})
export const downloadHistory = () => ({
  type: AT.DOWNLOAD_HISTORY
})

import { contains } from 'ramda'
import { actions, actionTypes, selectors } from 'data'

let timer, counter, interval
// Actions that won't refresh the autodisconnection timer
let blackListedActivityTypes = [
  // ETH
  actionTypes.middleware.webSocket.eth.MESSAGE_SOCKET,
  actionTypes.core.data.eth.FETCH_ETH_LATEST_BLOCK_SUCCESS,
  actionTypes.core.data.eth.FETCH_ETH_LATEST_BLOCK_LOADING,
  actionTypes.core.data.eth.FETCH_ETH_LATEST_BLOCK_FAILURE,
  actionTypes.core.data.eth.FETCH_ETH_LATEST_BLOCK,
  actionTypes.core.data.eth.FETCH_ETH_DATA_SUCCESS,
  actionTypes.core.data.eth.FETCH_ETH_DATA_LOADING,
  actionTypes.core.data.eth.FETCH_ETH_DATA_FAILURE,
  actionTypes.core.data.eth.FETCH_ETH_DATA,
  // BTC
  actionTypes.middleware.webSocket.btc.MESSAGE_SOCKET,
  actionTypes.core.data.btc.SET_BTC_LATEST_BLOCK,
  actionTypes.core.data.btc.FETCH_BTC_TRANSACTIONS,
  actionTypes.core.data.btc.FETCH_BTC_TRANSACTIONS_LOADING,
  actionTypes.core.data.btc.FETCH_BTC_TRANSACTIONS_SUCCESS,
  actionTypes.core.data.btc.FETCH_BTC_TRANSACTIONS_FAILURE,
  actionTypes.core.data.btc.FETCH_BTC_DATA,
  actionTypes.core.data.btc.FETCH_BTC_DATA_LOADING,
  actionTypes.core.data.btc.FETCH_BTC_DATA_SUCCESS,
  actionTypes.core.data.btc.FETCH_BTC_DATA_FAILURE,
  // BCH
  actionTypes.middleware.webSocket.bch.MESSAGE_SOCKET,
  actionTypes.core.data.bch.SET_BCH_LATEST_BLOCK,
  actionTypes.core.data.bch.FETCH_BCH_TRANSACTIONS,
  actionTypes.core.data.bch.FETCH_BCH_TRANSACTIONS_LOADING,
  actionTypes.core.data.bch.FETCH_BCH_TRANSACTIONS_SUCCESS,
  actionTypes.core.data.bch.FETCH_BCH_TRANSACTIONS_FAILURE,
  actionTypes.core.data.bch.FETCH_BCH_DATA,
  actionTypes.core.data.bch.FETCH_BCH_DATA_LOADING,
  actionTypes.core.data.bch.FETCH_BCH_DATA_SUCCESS,
  actionTypes.core.data.bch.FETCH_BCH_DATA_FAILURE,
  // RATES
  actionTypes.middleware.webSocket.rates.MESSAGE_SOCKET,
  actionTypes.components.exchange.FETCH_LIMITS_SUCCESS,
  actionTypes.components.exchange.SET_MIN_MAX,
  actionTypes.modules.rates.UPDATE_BEST_RATES,
  // TODO: consider if we really need this
  '@@redux-form/CLEAR_SUBMIT_ERRORS',
  '@@redux-form/STOP_ASYNC_VALIDATION',
  '@@redux-form/START_ASYNC_VALIDATION'
]

const AutoDisconnectionMiddleware = () => store => next => action => {
  // We start the timer
  if (action.type === actionTypes.auth.START_LOGOUT_TIMER) {
    startTimer(store)
  }
  // We reset the timer if the action is not in the blacklist
  if (!contains(action.type, blackListedActivityTypes)) {
    resetTimer()
  }

  return next(action)
}

const startTimer = store => {
  counter = timer =
    parseInt(selectors.core.wallet.getLogoutTime(store.getState()) / 1000) ||
    600 // (Default: 10min )
  if (interval) {
    clearInterval(interval)
  }
  interval = setInterval(refreshTimer.bind(this, store), 1000)
}

const resetTimer = () => {
  counter = timer
}

const refreshTimer = store => {
  if (counter === 0) {
    if (interval) {
      clearInterval(interval)
    }
    store.dispatch(
      actions.modals.showModal('AutoDisconnection', { duration: timer / 60 })
    )
  }
  counter--
}

export default AutoDisconnectionMiddleware

import { includes } from 'ramda'

import { actions, actionTypes, selectors } from 'data'

let timer
let counter
let interval
// actions that won't reset the disconnection timer
const blackListedActivityTypes = [
  // ETH
  actionTypes.core.data.eth.FETCH_ETH_LATEST_BLOCK_SUCCESS,
  actionTypes.core.data.eth.FETCH_ETH_LATEST_BLOCK_LOADING,
  actionTypes.core.data.eth.FETCH_ETH_LATEST_BLOCK_FAILURE,
  actionTypes.core.data.eth.FETCH_ETH_LATEST_BLOCK,
  actionTypes.core.data.eth.FETCH_ETH_DATA_SUCCESS,
  actionTypes.core.data.eth.FETCH_ETH_DATA_LOADING,
  actionTypes.core.data.eth.FETCH_ETH_DATA_FAILURE,
  actionTypes.core.data.eth.FETCH_ETH_DATA,
  // BTC
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
  actionTypes.middleware.webSocket.rates.ADVICE_UNSUBSCRIBE_SUCCESS,
  actionTypes.middleware.webSocket.rates.ADVICE_SUBSCRIBE_SUCCESS,
  actionTypes.middleware.webSocket.rates.ADVICE_SUBSCRIBE_ERROR,
  actionTypes.middleware.webSocket.rates.MESSAGE_SOCKET,
  actionTypes.middleware.webSocket.rates.START_SOCKET,
  actionTypes.middleware.webSocket.rates.STOP_SOCKET,
  actionTypes.middleware.webSocket.rates.OPEN_SOCKET,
  actionTypes.modules.rates.UPDATE_BEST_RATES,
  // COINS
  actionTypes.middleware.webSocket.coins.OPEN_SOCKET,
  actionTypes.middleware.webSocket.coins.MESSAGE_SOCKET,
  actionTypes.middleware.webSocket.coins.CLOSE_SOCKET,
  // XLM
  actionTypes.middleware.webSocket.xlm.START_STREAMS,
  actionTypes.middleware.webSocket.xlm.STOP_STREAMS,
  actionTypes.middleware.webSocket.xlm.STREAM_MESSAGE,
  actionTypes.middleware.webSocket.xlm.STREAM_ERROR,
  // USER
  actionTypes.modules.profile.SET_API_TOKEN_SUCCESS,
  actionTypes.modules.profile.FETCH_USER_DATA_SUCCESS,
  actionTypes.modules.profile.FETCH_TIERS_SUCCESS,
  // LOGS
  actions.logs.logErrorMessage.type,

  // FORMS
  '@@redux-form/CLEAR_SUBMIT_ERRORS',
  '@@redux-form/STOP_ASYNC_VALIDATION',
  '@@redux-form/START_ASYNC_VALIDATION'
]

const refreshTimer = (store) => {
  if (counter === 0) {
    if (interval) {
      clearInterval(interval)
    }
    store.dispatch(actions.modals.showModal('AUTO_DISCONNECTION_MODAL', { duration: timer / 60 }))
  }
  // eslint-disable-next-line no-plusplus
  counter--
}

const startTimer = (store) => {
  // defaults to 10 min
  const autoDisconnectTime =
    parseInt(selectors.core.wallet.getLogoutTime(store.getState()) / 1000) || 600
  counter = autoDisconnectTime
  timer = autoDisconnectTime

  if (interval) {
    clearInterval(interval)
  }
  interval = setInterval(refreshTimer.bind(this, store), 1000)
}

const resetTimer = () => {
  counter = timer
}

const AutoDisconnectionMiddleware = () => (store) => (next) => (action) => {
  // start the timer
  if (action.type === actionTypes.auth.START_LOGOUT_TIMER) {
    startTimer(store)
  }
  // reset the timer if the action is not in the blacklist
  if (!includes(action.type, blackListedActivityTypes)) {
    // 👋 Uncomment the next line to debug autoDisconnection!!
    // console.log(action.type)
    resetTimer()
  }

  return next(action)
}

export default AutoDisconnectionMiddleware

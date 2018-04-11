import { contains } from 'ramda'
import { actions, actionTypes, selectors } from 'data'

let timer, counter, interval
// Actions that won't refresh the autodisconnection timer
let blackListedActivityTypes = [actionTypes.core.webSocket.bitcoin.MESSAGE_SOCKET]

const AutoDisconnectionMiddleware = () => (store) => (next) => (action) => {
  // We start the timer
  if (action.type === actionTypes.auth.START_LOGOUT_TIMER) {
    startTimer(store)
  }
  // We reset the timer if the action is not in the blacklist
  if (!contains(action.type, blackListedActivityTypes)) { resetTimer() }

  return next(action)
}

const startTimer = (store) => {
  counter = timer = parseInt(selectors.core.wallet.getLogoutTime(store.getState()) / 1000) || 600 // (Default: 10min )
  if (interval) { clearInterval(interval) }
  interval = setInterval(refreshTimer.bind(this, store), 1000)
}

const resetTimer = () => {
  counter = timer
}

const refreshTimer = (store) => {
  if (counter === 0) {
    if (interval) { clearInterval(interval) }
    store.dispatch(actions.modals.showModal('AutoDisconnection', { duration: timer / 60 }))
  }
  counter--
}

export default AutoDisconnectionMiddleware

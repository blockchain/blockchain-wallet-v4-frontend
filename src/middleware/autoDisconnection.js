import { contains } from 'ramda'
import { actions, actionTypes } from 'data'

let autoDisconnectionDefaultValue = 720
let autoDisconnectionNotificationDefaultValue = 120
let autoDisconnectionCounter = autoDisconnectionDefaultValue
let autoDisconnectionInterval
// Actions that won't refresh the autodisconnection timer
let blackListedActivityTypes = []

const AuthMiddleware = store => next => action => {
  // Once we login successfully, we start the autodisconnection timer
  if (action.type === actionTypes.auth.LOGIN_SUCCESS) {
    if (autoDisconnectionInterval) { clearInterval(autoDisconnectionInterval) }
    autoDisconnectionInterval = setInterval(refreshCounter(store), 1000)
  }
  // We don't refresh the disconnection timer if the action is in the blacklist
  if (!contains(action.type, blackListedActivityTypes)) {
    autoDisconnectionCounter = autoDisconnectionDefaultValue
  }

  return next(action)
}

const refreshCounter = (store) => () => {
  if (autoDisconnectionCounter === autoDisconnectionNotificationDefaultValue) {
    store.dispatch(actions.auth.autoLogoutStart())
  }
  if (autoDisconnectionCounter === 0) {
    store.dispatch(actions.auth.logoutStart())
    clearInterval(autoDisconnectionInterval)
  }
  autoDisconnectionCounter--
}

export default AuthMiddleware

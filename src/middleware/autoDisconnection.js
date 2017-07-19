import { contains } from 'ramda'
import { actions, actionTypes, selectors } from 'data'

let timer, counter, interval
// Actions that won't refresh the autodisconnection timer
let blackListedActivityTypes = []

const AuthMiddleware = store => next => action => {
  // We start the timer
  if (action.type === actionTypes.auth.LOGOUT_START_TIMER) {
    counter = timer = 5
    startTimer(store)
  }
  // We reset the timer
  if (action.type === actionTypes.auth.LOGOUT_RESET_TIMER) { resetTimer() }
  // We reset the timer if the action is not in the blacklist
  if (!contains(action.type, blackListedActivityTypes)) { resetTimer() }

  return next(action)
}

const startTimer = (store) => {
  if (interval) { clearInterval(interval) }
  interval = setInterval(refreshTimer(store), 1000)
}

const resetTimer = () => {
  counter = timer
}

const stopTimer = () => {
  if (interval) { clearInterval(interval) }
}

const refreshTimer = store => () => {
  if (counter === 0) {
    store.dispatch(actions.modals.showModalAutoDisconnection(timer))
    stopTimer()
  }
  counter--
}

export default AuthMiddleware

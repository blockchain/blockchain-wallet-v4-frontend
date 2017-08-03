import { head, last, split } from 'ramda'
import { actions } from 'data'

const NotificationsMiddleware = store => next => action => {
  // We start the timer
  if (head(split('.', action.type)) === '@CORE' && last(split('_', action.type)) === 'ERROR') {
    store.dispatch(actions.alerts.displayError(action.payload))
  }

  return next(action)
}

export default NotificationsMiddleware

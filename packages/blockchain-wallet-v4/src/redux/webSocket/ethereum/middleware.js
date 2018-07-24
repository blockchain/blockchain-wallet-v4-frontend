import { compose } from 'ramda'
import * as A from './actions'
import * as T from './actionTypes'

const socket = (socket) => (store) => {
  return (next) => (action) => {
    const { type } = action

    if (type === T.START_SOCKET) {
      socket.connect(
        compose(store.dispatch, A.openSocket),
        compose(store.dispatch, A.messageSocket),
        compose(store.dispatch, A.closeSocket)
      )
    }

    if (type === T.STOP_SOCKET) { socket.close() }

    return next(action)
  }
}

export default socket

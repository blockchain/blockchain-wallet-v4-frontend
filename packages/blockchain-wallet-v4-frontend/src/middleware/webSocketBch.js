import { compose } from 'ramda'
import { actions, actionTypes } from 'data'

const socket = (socket) => (store) => {
  return (next) => (action) => {
    const { type } = action

    if (type === actionTypes.middleware.webSocket.bch.START_SOCKET) {
      socket.connect(
        compose(store.dispatch, actions.middleware.webSocket.bch.openSocket),
        compose(store.dispatch, actions.middleware.webSocket.bch.messageSocket),
        compose(store.dispatch, actions.middleware.webSocket.bch.closeSocket)
      )
    }

    if (type === actionTypes.middleware.webSocket.bch.STOP_SOCKET) { socket.close() }

    return next(action)
  }
}

export default socket

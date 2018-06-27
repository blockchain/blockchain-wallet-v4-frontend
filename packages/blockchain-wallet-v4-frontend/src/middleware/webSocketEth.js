import { compose } from 'ramda'
import { actions, actionTypes } from 'data'

const socket = (socket) => (store) => {
  return (next) => (action) => {
    const { type } = action

    if (type === actionTypes.middleware.webSocket.eth.START_SOCKET) {
      socket.connect(
        compose(store.dispatch, actions.middleware.webSocket.eth.openSocket),
        compose(store.dispatch, actions.middleware.webSocket.eth.messageSocket),
        compose(store.dispatch, actions.middleware.webSocket.eth.closeSocket)
      )
    }

    if (type === actionTypes.middleware.webSocket.eth.STOP_SOCKET) { socket.close() }

    return next(action)
  }
}

export default socket

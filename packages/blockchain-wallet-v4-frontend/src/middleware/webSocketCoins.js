import { actions, actionTypes } from 'data'
import { compose } from 'ramda'

const socket = socket => store => {
  return next => action => {
    const { type } = action

    if (type === actionTypes.middleware.webSocket.coins.START_SOCKET) {
      socket.connect(
        compose(store.dispatch, actions.middleware.webSocket.coins.openSocket),
        compose(
          store.dispatch,
          actions.middleware.webSocket.coins.messageSocket
        ),
        compose(store.dispatch, actions.middleware.webSocket.coins.closeSocket)
      )
    }

    if (type === actionTypes.middleware.webSocket.coins.STOP_SOCKET) {
      socket.close()
    }

    return next(action)
  }
}

export default socket

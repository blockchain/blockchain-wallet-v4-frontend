import { compose } from 'ramda'
import { actions, actionTypes } from 'data'

const socket = socket => store => {
  return next => action => {
    const { type } = action

    if (type === actionTypes.middleware.webSocket.sd.START_SOCKET) {
      socket.connect(
        compose(
          store.dispatch,
          actions.middleware.webSocket.sd.openSocket
        ),
        compose(
          store.dispatch,
          actions.middleware.webSocket.sd.messageSocket
        ),
        compose(
          store.dispatch,
          actions.middleware.webSocket.sd.closeSocket
        )
      )
    }

    if (type === actionTypes.middleware.webSocket.sd.STOP_SOCKET) {
      socket.close()
    }

    return next(action)
  }
}

export default socket

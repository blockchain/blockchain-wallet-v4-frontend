import { compose } from 'ramda'
import { actions, actionTypes } from 'data'

export const fallbackInterval = 5000
let fallbackIntervalPID = null

const socket = socket => store => {
  return next => action => {
    const { type } = action

    if (type === actionTypes.middleware.webSocket.publicRates.START_SOCKET) {
      clearInterval(fallbackIntervalPID)
      socket.connect(
        // onOpen
        compose(
          store.dispatch,
          actions.middleware.webSocket.publicRates.openSocket
        ),
        // onMessage
        compose(
          store.dispatch,
          actions.middleware.webSocket.publicRates.messageSocket
        ),
        // onClose
        compose(
          store.dispatch,
          actions.middleware.webSocket.publicRates.closeSocket
        ),
        // onError
        // eslint-disable-next-line no-console
        e => console.error('Failed to connect to websocket', e),
        // fallback
        () => {
          fallbackIntervalPID = setInterval(
            compose(
              store.dispatch,
              actions.middleware.webSocket.publicRates.restFallback
            ),
            fallbackInterval
          )
        }
      )
    }

    if (type === actionTypes.middleware.webSocket.publicRates.STOP_SOCKET) {
      socket.close()
    }

    return next(action)
  }
}

export default socket

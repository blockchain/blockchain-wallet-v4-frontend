import { compose } from 'ramda'

import { actions, actionTypes } from 'data'

export const fallbackInterval = 5000
let fallbackIntervalPID = null

const socket = socket => store => {
  return next => action => {
    const { type } = action

    if (type === actionTypes.middleware.webSocket.rates.START_SOCKET) {
      clearInterval(fallbackIntervalPID)
      socket.connect(
        // onOpen
        compose(store.dispatch, actions.middleware.webSocket.rates.openSocket),
        // onMessage
        compose(
          store.dispatch,
          actions.middleware.webSocket.rates.messageSocket
        ),
        // onClose
        compose(store.dispatch, actions.middleware.webSocket.rates.closeSocket),
        // onError
        // eslint-disable-next-line no-console
        e => console.error('Failed to connect to websocket', e),
        // fallback
        () => {
          fallbackIntervalPID = setInterval(
            compose(
              store.dispatch,
              actions.middleware.webSocket.rates.restFallback
            ),
            fallbackInterval
          )
        }
      )
    }

    if (type === actionTypes.middleware.webSocket.rates.STOP_SOCKET) {
      socket.close()
    }

    return next(action)
  }
}

export default socket

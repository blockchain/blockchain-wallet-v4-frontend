import { compose } from 'ramda'

import { actions, actionTypes } from 'data'

export const fallbackInterval = 5000
const fallbackIntervalPID = null

const socket = (socket) => (store) => {
  return (next) => (action) => {
    const { type } = action

    if (type === actionTypes.middleware.webSocket.activities.START_SOCKET) {
      clearInterval(fallbackIntervalPID)
      socket.connect(
        // onOpen
        compose(store.dispatch, actions.middleware.webSocket.activities.openSocket),
        // onMessage
        compose(store.dispatch, actions.middleware.webSocket.activities.messageSocket),
        // onClose
        compose(store.dispatch, actions.middleware.webSocket.activities.closeSocket),
        // onError
        // eslint-disable-next-line no-console
        (e) => console.error('Failed to connect to websocket', e),
        // fallback
        () => {
          // fallbackIntervalPID = setInterval(
          //   compose(store.dispatch, actions.middleware.webSocket.activities.restFallback),
          //   fallbackInterval
          // )
        }
      )
    }

    if (type === actionTypes.middleware.webSocket.activities.STOP_SOCKET) {
      socket.close()
    }

    return next(action)
  }
}

export default socket

import { compose, prop } from 'ramda'
import { Socket } from 'blockchain-wallet-v4/src/network'
import { actions, actionTypes } from 'data'

const socket = (socket) => (store) => {
  const send = socket.send.bind(socket)
  return (next) => (action) => {
    const { type } = action

    let whitelist = {
      [actionTypes.core.wallet.CREATE_LEGACY_ADDRESS]: compose(send, Socket.addrSubMessage, prop('address'))
    }

    if (type === actionTypes.middleware.webSocket.btc.START_SOCKET) {
      socket.connect(
        compose(store.dispatch, actions.middleware.webSocket.btc.openSocket),
        compose(store.dispatch, actions.middleware.webSocket.btc.messageSocket),
        compose(store.dispatch, actions.middleware.webSocket.btc.closeSocket)
      )
    }

    if (type === actionTypes.middleware.webSocket.btc.STOP_SOCKET) { socket.close() }

    if (whitelist[type]) whitelist[type](action)

    return next(action)
  }
}

export default socket

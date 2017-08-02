import { compose, prop } from 'ramda'
import { Socket } from '../../network'
import * as A from '../actions'
import * as T from '../actionTypes'

const socket = ({ socket, walletPath }) => (store) => {
  const send = socket.send.bind(socket)

  return (next) => (action) => {
    const { type } = action

    let whitelist = {
      [T.wallet.CREATE_LEGACY_ADDRESS]: compose(send, Socket.addrSubMessage, prop('address'))
    }

    if (type === T.webSocket.START_SOCKET) {
      socket.connect(
        compose(store.dispatch, A.webSocket.openSocket),
        compose(store.dispatch, A.webSocket.messageSocket),
        compose(store.dispatch, A.webSocket.closeSocket)
      )
    }

    if (type === T.webSocket.STOP_SOCKET) { socket.close() }

    if (whitelist[type]) whitelist[type](action)

    return next(action)
  }
}

export default socket

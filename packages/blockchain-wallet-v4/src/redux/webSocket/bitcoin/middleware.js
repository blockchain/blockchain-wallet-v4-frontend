import { compose, prop } from 'ramda'
import { Socket } from '../../../network/index'
import * as A from './actions'
import * as T from './actionTypes'
import * as walletTypes from '../../wallet/actionTypes'

const socket = ({ socket }) => (store) => {
  const send = socket.send.bind(socket)
  return (next) => (action) => {
    const { type } = action

    let whitelist = {
      [walletTypes.CREATE_LEGACY_ADDRESS]: compose(send, Socket.addrSubMessage, prop('address'))
    }

    if (type === T.START_SOCKET) {
      socket.connect(
        compose(store.dispatch, A.openSocket),
        compose(store.dispatch, A.messageSocket),
        compose(store.dispatch, A.closeSocket)
      )
    }

    if (type === T.STOP_SOCKET) { socket.close() }

    if (whitelist[type]) whitelist[type](action)

    return next(action)
  }
}

export default socket

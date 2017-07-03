import { compose, prop } from 'ramda'
import { Socket } from '../../../network'
import * as A from '../actions'
import * as T from '../actionTypes'

const socket = (options) => (store) => {
  let { socket } = options
  let send = socket.send.bind(socket)

  socket.connect(
    compose(store.dispatch, A.openSocket),
    compose(store.dispatch, A.messageSocket, JSON.parse, prop('data')),
    compose(store.dispatch, A.closeSocket)
  )

  let whitelist = {
    [T.CREATE_ADDRESS]: compose(send, Socket.addrSubMessage, prop('address'))
  }

  return (next) => (action) => {
    let { type } = action
    if (whitelist[type]) whitelist[type](action)
    return next(action)
  }
}

export default socket

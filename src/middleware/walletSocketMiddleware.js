
import { compose, prop } from 'ramda'
import { Socket } from '../network'
import { ADDRESS_ADD } from '../actions'

// NOTE: move these actions and action creators to src/actions?
const SOCKET_OPEN = '@v3.SOCKET_OPEN'
const SOCKET_MESSAGE = '@v3.SOCKET_MESSAGE'
const SOCKET_CLOSE = '@v3.SOCKET_CLOSE'

let onOpenAction = () => ({ type: SOCKET_OPEN })
let onMessageAction = (data) => ({ type: SOCKET_MESSAGE, data })
let onCloseAction = () => ({ type: SOCKET_CLOSE })

const walletSocketMiddleware = (options) => (store) => {
  let { socket } = options
  let send = socket.send.bind(socket)

  socket.connect(
    compose(store.dispatch, onOpenAction),
    compose(store.dispatch, onMessageAction, JSON.parse, prop('data')),
    compose(store.dispatch, onCloseAction)
  )

  let whitelist = {
    [ADDRESS_ADD]: compose(send, Socket.addrSubMessage, prop('address'))
  }

  return (next) => (action) => {
    let { type } = action
    if (whitelist[type]) whitelist[type](action)
    return next(action)
  }
}

export default walletSocketMiddleware

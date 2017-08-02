import { compose, prop } from 'ramda'
import { Socket } from '../../network'
import * as A from './actions'
import * as T from './actionTypes'
// import * as selectors from '../selectors'

const socket = ({ socket, walletPath, isAuthenticated }) => (store) => {
  const send = socket.send.bind(socket)
  // const getWrapper = () => store.getState()[walletPath]

  return (next) => (action) => {
    const { type } = action
    // const prevWallet = store.getState()[walletPath]
    const wasAuth = isAuthenticated(store.getState())
    const result = next(action)
    // const nextWallet = store.getState()[walletPath]
    const isAuth = isAuthenticated(store.getState())

    let whitelist = {
      [T.CREATE_LEGACY_ADDRESS]: compose(send, Socket.addrSubMessage, prop('address'))
      // [T.SET_WRAPPER]: compose(send, Socket.onOpenMessage, selectors.getInitialSocketContext, getWrapper)
    }

    if (!wasAuth && isAuth) { // start socket when logged in
      socket.connect(
        compose(store.dispatch, A.openSocket),
        compose(store.dispatch, A.messageSocket),
        compose(store.dispatch, A.closeSocket)
      )
    }

    if (wasAuth && isAuth && whitelist[type]) whitelist[type](action)

    return result
  }
}

export default socket

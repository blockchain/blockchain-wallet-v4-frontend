import { compose } from 'ramda'
import * as A from './actions'
import * as T from './actionTypes'

const socket = (tcp) => (store) => {
  return (next) => (action) => {
    const { type } = action

    if (type === T.START_SOCKET) {
      tcp.connectToMaster(
        compose(store.dispatch, A.onSocketOpen),
        compose(store.dispatch, A.onSocketClose),
        compose(store.dispatch, A.onPeerOpen),
        compose(store.dispatch, A.onPeerMessage),
        compose(store.dispatch, A.onPeerClose)
      )
    }

    if (type === T.STOP_SOCKET) { tcp.close() }

    return next(action)
  }
}

export default socket

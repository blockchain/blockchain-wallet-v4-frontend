
import * as T from './actionTypes'

// The state is a mapping of public key to connection objects
const INITIAL_STATE = {}

const INITIAL_PEER_STATE = {
  conn: undefined,
  connected: true,
  initSent: true,
  initReceived: false,

  gfRemote: [],
  lfRemote: [],

  channels: [],

  lastPing: 0,

  error: null
}
const peersReducer = (state = INITIAL_STATE, action) => {
  //console.log(action)
  const { type, publicKey } = action

  switch (type) {
    case T.ADD: {
      console.log(publicKey.toString('hex'))
      let copy = Object.assign({}, state)
      copy[publicKey.toString('hex')] = Object.assign({}, INITIAL_PEER_STATE)
      return copy
    }
    case T.REMOVE: {
      let copy = Object.assign({}, state)
      copy[publicKey.toString('hex')] = undefined
      return copy
    }
    case T.DISCONNECTED: {

    }
    case T.CONNECTED: {

    }

    default: return state
  }
}

export default peersReducer

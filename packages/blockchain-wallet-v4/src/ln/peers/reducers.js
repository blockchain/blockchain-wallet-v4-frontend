
import * as T from './actionTypes'

// The state is a mapping of public key to connection objects
const INITIAL_STATE = {}

const INITIAL_PEER_STATE = {
  connected: false,
  lastPing: 0,
  error: null
}

const peersReducer = (state = INITIAL_STATE, action) => {
  //console.log(action)
  const { type, pubKey } = action

  switch (type) {
    case T.ADD: {
      console.log(pubKey.toString('hex'))
      let copy = Object.assign({}, state)
      copy[pubKey.toString('hex')] = Object.assign({}, INITIAL_PEER_STATE)
      return copy
    }
    case T.REMOVE: {
      let copy = Object.assign({}, state)
      copy[pubKey.toString('hex')] = undefined
      return copy
    }
    case T.DISCONNECTED: {
      if (state[pubKey] === undefined) {
        return state
      }
      let copy = Object.assign({}, state)
      copy[pubKey].connected = false
      return copy
    }

    case T.CONNECTED: {
      if (state[pubKey] === undefined) {
        return state
      }
      let copy = Object.assign({}, state)
      copy[pubKey].connected = true
      return copy
    }

    case T.PING_RECEIVED: {
      if (state[pubKey] === undefined) {
        return state
      }
      let copy = Object.assign({}, state)
      copy[pubKey].lastPing = Date.now()
    }

    default: return state
  }
}

export default peersReducer

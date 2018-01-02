import * as T from './actionTypes.js'

// The state is a mapping of public key to
const INITIAL_STATE = {
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

export const peerReducer = (state = INITIAL_STATE, action) => {
  const { type, peer } = action
  switch (type) {
    case T.ADD: {
      return state
    }
    case T.REMOVE: {
      return undefined
    }
    case T.CONNECTED: {
      let copy = Object.assign({}, state)
      copy[peer] = PEER_INITIAL_STATE
      return copy
    }
    case T.DISCONNECTED: {
      return undefined
    }
    default: return state
  }
}

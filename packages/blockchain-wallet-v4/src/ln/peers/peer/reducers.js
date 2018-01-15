import * as T from './actionTypes.js'

// Button (connect to node X)
// ACTION_CONNECT
// -> sagas
//       connect
//       do the handshake
//       ACTION_ADD

// SET_PING_TIME
// ACTION_ERROR
// ACTION_SEND_MESSAGE
// -> sagas
//        send message

// The state is a mapping of public key to
const INITIAL_STATE = {
  conn: undefined,
  connected: true,
  initSent: true,
  initReceived: false,

  gfRemote: [],
  lfRemote: [],

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
    // TODO add other action types as one progresses with sagas

    default: return state
  }
}

import {peerReducer} from './peer/reducers'

// The state is a mapping of public key to connection objects
const INITIAL_STATE = {}

export const peersReducer = (state = INITIAL_STATE, action) => {
  const { type, publicKey } = action

  let oldState = state[publicKey]
  let newState = peerReducer(oldState, action)

  if (oldState === newState) {
    return state
  } else {
    let copy = Object.assign({}, state)
    copy[publicKey] = oldState
    return copy
  }
}

export default peerReducer

import {peerReducer} from './peer/reducers.js'
import {ADD} from './peer/actionTypes'

// The state is a mapping of public key to connection objects
const INITIAL_STATE = {}

const peersReducer = (state = INITIAL_STATE, action) => {
  const { type, publicKey } = action

  let oldState = state[publicKey]

  if (oldState === undefined && type !== ADD) {
    return state
  } else {

    let newState = peerReducer(oldState, action)
    console.info(oldState)
    console.info(newState)

    if (oldState === newState) {

      return state
    } else {
      let copy = Object.assign({}, state)
      copy[publicKey] = newState
      return copy
    }
  }
}

export default peersReducer

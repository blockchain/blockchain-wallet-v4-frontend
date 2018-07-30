import { assoc } from 'ramda'
import * as AT from './actionTypes'

const INITIAL_STATE = {
  connecting: false,
  deviceInfo: {}
}

export default (state = INITIAL_STATE, action) => {
  const { type, payload } = action

  switch (type) {
    case AT.SET_CARBON_XPUBS: {
      return assoc('xpubs', payload.xpubs, state)
    }
    default:
      return state
  }
}

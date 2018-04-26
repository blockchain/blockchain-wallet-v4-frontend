import { assocPath } from 'ramda'
import * as AT from './actionTypes'

const INITIAL_STATE = {}

export default (state = INITIAL_STATE, action) => {
  const { type, payload } = action

  switch (type) {
    case AT.TOGGLE_USED_ADDRESSES: {
      return assocPath([payload.walletIndex, 'visible'], payload.visible, state)
    }
    default:
      return state
  }
}

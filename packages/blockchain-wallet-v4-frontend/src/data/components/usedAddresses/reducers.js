import { assoc } from 'ramda'
import * as AT from './actionTypes'

const INITIAL_STATE = {
  showUsedAddresses: false
}

export default (state = INITIAL_STATE, action) => {
  const { type } = action

  switch (type) {
    case AT.TOGGLE_USED_ADDRESSES: {
      return assoc('showUsedAddresses', !state.showUsedAddresses, state)
    }
    default:
      return state
  }
}

import { assoc } from 'ramda'

import * as AT from './actionTypes'

const INITIAL_STATE = {
  address: null
}

export default (state = INITIAL_STATE, action) => {
  const { payload, type } = action
  switch (type) {
    case AT.SET_ADDRESS: {
      return assoc('address', payload.address, state)
    }
    default:
      return state
  }
}

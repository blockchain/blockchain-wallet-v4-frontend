import * as AT from './actionTypes'
import { assoc } from 'ramda'

const INITIAL_STATE = {
  qaSellAddress: null
}

const qa = (state = INITIAL_STATE, action) => {
  const { type, payload } = action

  switch (type) {
    case AT.QA_SET_SELL_ADDRESS: {
      return assoc('qaSellAddress', payload, state)
    }
    default:
      return state
  }
}

export default qa

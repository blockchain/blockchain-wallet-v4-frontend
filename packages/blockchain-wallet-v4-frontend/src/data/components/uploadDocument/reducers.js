import { assoc } from 'ramda'
import * as AT from './actionTypes'

export const INITIAL_STATE = {
  uploaded: false
}

export default (state = INITIAL_STATE, action) => {
  const { payload, type } = action

  switch (type) {
    case AT.SET_REFERENCE: {
      return assoc('reference', payload.reference, state)
    }
    case AT.SET_UPLOADED: {
      return assoc('uploaded', true, state)
    }
    default:
      return state
  }
}

import { assoc } from 'ramda'
import * as AT from './actionTypes'

const INITIAL_STATE = {
  step: 1,
  signedMessage: ''
}

export default (state = INITIAL_STATE, action) => {
  const { type, payload } = action

  switch (type) {
    case AT.SIGN_MESSAGE_INITIALIZED: {
      return INITIAL_STATE
    }
    case AT.SIGN_MESSAGE_SUBMITTED: {
      return assoc('step', 2, state)
    }
    case AT.RESET_FORM_CLICKED: {
      return assoc('step', 1, state)
    }
    case AT.MESSAGE_SIGNED: {
      return assoc('signedMessage', payload.signedMessage, state)
    }
    default:
      return state
  }
}

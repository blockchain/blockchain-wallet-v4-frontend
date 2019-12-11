import * as AT from './actionTypes'
import { assoc, compose } from 'ramda'

const INITIAL_STATE = {
  step: 1,
  signedMessage: ''
}

export default (state = INITIAL_STATE, action) => {
  const { type, payload } = action

  switch (type) {
    case AT.BCH_SIGN_MESSAGE_INITIALIZED: {
      return INITIAL_STATE
    }
    case AT.BCH_SIGN_MESSAGE_SUBMITTED: {
      return state // assoc('step', 2, state)
    }
    case AT.BCH_RESET_FORM_CLICKED: {
      return assoc('step', 1, state)
    }
    case AT.BCH_MESSAGE_SIGNED: {
      return compose(
        assoc('step', 2),
        assoc('signedMessage', payload.signedMessage)
      )(state)
    }
    default:
      return state
  }
}

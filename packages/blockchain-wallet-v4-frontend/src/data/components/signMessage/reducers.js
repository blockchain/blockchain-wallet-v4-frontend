import { assoc, compose } from 'ramda'

import * as AT from './actionTypes'

const INITIAL_STATE = {
  step: 1,
  signedMessage: ''
}

export default (state = INITIAL_STATE, action) => {
  const { payload, type } = action

  switch (type) {
    case AT.SIGN_MESSAGE_INITIALIZED: {
      return INITIAL_STATE
    }
    case AT.SIGN_MESSAGE_SUBMITTED: {
      return state // assoc('step', 2, state)
    }
    case AT.RESET_FORM_CLICKED: {
      return assoc('step', 1, state)
    }
    case AT.MESSAGE_SIGNED: {
      return compose(
        assoc('step', 2),
        assoc('signedMessage', payload.signedMessage)
      )(state)
    }
    default:
      return state
  }
}

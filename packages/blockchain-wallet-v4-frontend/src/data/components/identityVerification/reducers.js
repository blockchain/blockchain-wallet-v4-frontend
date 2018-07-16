import { Remote } from 'blockchain-wallet-v4/src'
import { assoc } from 'ramda'
import { STEPS } from './model'
import * as AT from './actionTypes'

const INITIAL_STATE = {
  onfidoEnabled: false,
  step: Remote.of(STEPS.personal),
  personalStep: Remote.Loading,
  emailStep: Remote.Loading,
  smsStep: Remote.Loading
}

export default (state = INITIAL_STATE, action) => {
  const { type, payload } = action

  switch (type) {
    case AT.SET_ONFIDO_ENABLED: {
      return assoc('onfidoEnabled', payload.enabled, state)
    }
    case AT.SET_VERIIFICATION_STEP: {
      return assoc('step', Remote.of(payload.step), state)
    }
    case AT.SET_PERSONAL_STEP: {
      return assoc('personalStep', Remote.of(payload.step), state)
    }
    case AT.SET_EMAIL_STEP: {
      return assoc('emailStep', Remote.of(payload.step), state)
    }
    case AT.SET_SMS_STEP: {
      return assoc('smsStep', Remote.of(payload.step), state)
    }
    default:
      return state
  }
}

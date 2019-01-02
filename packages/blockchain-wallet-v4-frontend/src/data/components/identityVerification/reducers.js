import { Remote } from 'blockchain-wallet-v4/src'
import { assoc } from 'ramda'

import * as AT from './actionTypes'
import { EMAIL_STEPS } from './model'

const INITIAL_STATE = {
  addressRefetchVisible: false,
  verificationStep: null,
  smsStep: Remote.Loading,
  emailStep: EMAIL_STEPS.edit,
  supportedCountries: Remote.NotAsked,
  supportedDocuments: Remote.NotAsked,
  flowConfig: Remote.NotAsked,
  states: Remote.NotAsked,
  steps: Remote.NotAsked
}

export default (state = INITIAL_STATE, action) => {
  const { type, payload } = action

  switch (type) {
    case AT.SET_VERIFICATION_STEP: {
      return assoc('verificationStep', payload.step, state)
    }
    case AT.SET_SMS_STEP: {
      return assoc('smsStep', Remote.of(payload.step), state)
    }
    case AT.SET_EMAIL_STEP: {
      return assoc('emailStep', payload.step, state)
    }
    case AT.SET_SUPPORTED_COUNTRIES: {
      return assoc('supportedCountries', payload.countries, state)
    }
    case AT.SET_SUPPORTED_DOCUMENTS: {
      return assoc('supportedDocuments', payload.documentTypes, state)
    }
    case AT.SET_STATES: {
      return assoc('states', payload.states, state)
    }
    case AT.SET_KYC_FLOW_CONFIG: {
      return assoc('flowConfig', payload.flowConfig, state)
    }
    case AT.SET_STEPS_LOADING: {
      return assoc('steps', Remote.Loading, state)
    }
    case AT.SET_STEPS_FAILURE: {
      return assoc('steps', Remote.Failure(payload.error), state)
    }
    case AT.SET_STEPS_SUCCESS: {
      return assoc('steps', Remote.Success(payload.steps), state)
    }
    default:
      return state
  }
}

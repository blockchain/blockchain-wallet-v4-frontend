import { Remote } from 'blockchain-wallet-v4/src'
import { assoc } from 'ramda'
import * as AT from './actionTypes'

const INITIAL_STATE = {
  addressRefetchVisible: false,
  verificationStep: null,
  smsStep: Remote.Loading,
  supportedCountries: Remote.NotAsked,
  supportedDocuments: Remote.NotAsked,
  states: Remote.NotAsked,
  flowType: Remote.NotAsked
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
    case AT.SET_SUPPORTED_COUNTRIES: {
      return assoc('supportedCountries', payload.countries, state)
    }
    case AT.SET_SUPPORTED_DOCUMENTS: {
      return assoc('supportedDocuments', payload.documentTypes, state)
    }
    case AT.SET_STATES: {
      return assoc('states', payload.states, state)
    }
    case AT.SET_KYCFLOW: {
      return assoc('flowType', payload.flowType, state)
    }
    default:
      return state
  }
}

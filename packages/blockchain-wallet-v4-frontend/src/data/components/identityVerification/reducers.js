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
  preIdvData: Remote.NotAsked,
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
    case AT.SET_SUPPORTED_COUNTRIES_LOADING: {
      return assoc('supportedCountries', Remote.Loading, state)
    }
    case AT.SET_SUPPORTED_COUNTRIES_SUCCESS: {
      return assoc(
        'supportedCountries',
        Remote.Success(payload.countries),
        state
      )
    }
    case AT.SET_SUPPORTED_COUNTRIES_FAILURE: {
      return assoc('supportedCountries', Remote.Failure(payload.e), state)
    }
    case AT.SET_SUPPORTED_DOCUMENTS_LOADING: {
      return assoc('supportedDocuments', Remote.Loading, state)
    }
    case AT.SET_SUPPORTED_DOCUMENTS_SUCCESS: {
      return assoc(
        'supportedDocuments',
        Remote.Success(payload.documentTypes),
        state
      )
    }
    case AT.SET_SUPPORTED_DOCUMENTS_FAILURE: {
      return assoc('supportedDocuments', Remote.Failure(payload.e), state)
    }
    case AT.SET_STATES_LOADING: {
      return assoc('states', Remote.Loading, state)
    }
    case AT.SET_STATES_SUCCESS: {
      return assoc('states', Remote.Success(payload.states), state)
    }
    case AT.SET_STATES_FAILURE: {
      return assoc('states', Remote.Failure(payload.e), state)
    }
    case AT.SET_KYC_FLOW_LOADING: {
      return assoc('flowConfig', Remote.Loading, state)
    }
    case AT.SET_KYC_FLOW_SUCCESS: {
      return assoc('flowConfig', Remote.Success(payload.flowType), state)
    }
    case AT.SET_KYC_FLOW_FAILURE: {
      return assoc('flowConfig', Remote.Failure(payload.e), state)
    }
    case AT.SET_PRE_IDV_DATA_SUCCESS: {
      return assoc('preIdvData', Remote.Success(payload.preIdvData), state)
    }
    case AT.SET_PRE_IDV_DATA_FAILURE: {
      return assoc('preIdvData', Remote.Failure(payload.e), state)
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

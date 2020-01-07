import * as AT from './actionTypes'
import { assoc } from 'ramda'
import {
  EMAIL_STEPS,
  IdentityVerificationActionTypes,
  IdentityVerificationState
} from './types'
import Remote from 'blockchain-wallet-v4/src/remote/remote'

const INITIAL_STATE: IdentityVerificationState = {
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

export default (
  state = INITIAL_STATE,
  action: IdentityVerificationActionTypes
): IdentityVerificationState => {
  const { type, payload } = action

  switch (type) {
    case AT.SET_VERIFICATION_STEP: {
      return {
        ...state,
        verificationStep: payload.step
      }
    }
    // case AT.SET_SMS_STEP: {
    //   return {
    //     ...state,
    //     smsStep: Remote.Success(payload.step)
    //   }
    // }
    // case AT.SET_EMAIL_STEP: {
    //   return {
    //     ...state,
    //     emailStep: payload.step
    //   }
    // }
    // case AT.SET_SUPPORTED_COUNTRIES_LOADING: {
    //   return {
    //     ...state,
    //     supportedCountries: Remote.Loading
    //   }
    // }
    // case AT.SET_SUPPORTED_COUNTRIES_SUCCESS: {
    //   return {
    //     ...state,
    //     supportedCountries: Remote.Success(payload.countries)
    //   }
    // }
    // case AT.SET_SUPPORTED_COUNTRIES_FAILURE: {
    //   return {
    //     ...state,
    //     supportedCountries: Remote.Failure(payload.e)
    //   }
    // }
    // case AT.SET_SUPPORTED_DOCUMENTS_LOADING: {
    //   return {
    //     ...state,
    //     supportedDocuments: Remote.Loading
    //   }
    // }
    case AT.SET_SUPPORTED_DOCUMENTS_SUCCESS: {
      return {
        ...state,
        supportedDocuments: Remote.Success(payload.documentTypes)
      }
    }
    // case AT.SET_SUPPORTED_DOCUMENTS_FAILURE: {
    //   return assoc('supportedDocuments', Remote.Failure(payload.e), state)
    // }
    // case AT.SET_STATES_LOADING: {
    //   return assoc('states', Remote.Loading, state)
    // }
    // case AT.SET_STATES_SUCCESS: {
    //   return assoc('states', Remote.Success(payload.states), state)
    // }
    // case AT.SET_STATES_FAILURE: {
    //   return assoc('states', Remote.Failure(payload.e), state)
    // }
    // case AT.SET_KYC_FLOW_LOADING: {
    //   return assoc('flowConfig', Remote.Loading, state)
    // }
    // case AT.SET_KYC_FLOW_SUCCESS: {
    //   return assoc('flowConfig', Remote.Success(payload.flowType), state)
    // }
    // case AT.SET_KYC_FLOW_FAILURE: {
    //   return assoc('flowConfig', Remote.Failure(payload.e), state)
    // }
    // case AT.SET_PRE_IDV_DATA_SUCCESS: {
    //   return assoc('preIdvData', Remote.Success(payload.preIdvData), state)
    // }
    // case AT.SET_PRE_IDV_DATA_FAILURE: {
    //   return assoc('preIdvData', Remote.Failure(payload.e), state)
    // }
    // case AT.SET_STEPS_LOADING: {
    //   return assoc('steps', Remote.Loading, state)
    // }
    // case AT.SET_STEPS_FAILURE: {
    //   return assoc('steps', Remote.Failure(payload.error), state)
    // }
    // case AT.SET_STEPS_SUCCESS: {
    //   return assoc('steps', Remote.Success(payload.steps), state)
    // }
    default:
      return state
  }
}

import Remote from 'blockchain-wallet-v4/src/remote/remote'

import * as AT from './actionTypes'
import { EMAIL_STEPS } from './model'
import {
  IdentityVerificationActionTypes,
  IdentityVerificationState
} from './types'

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

export function identityVerificationReducer(
  state = INITIAL_STATE,
  action: IdentityVerificationActionTypes
): IdentityVerificationState {
  switch (action.type) {
    case AT.SET_VERIFICATION_STEP: {
      return {
        ...state,
        verificationStep: action.payload.step
      }
    }
    case AT.RESET_VERIFICATION_STEP: {
      return {
        ...state,
        verificationStep: null
      }
    }
    case AT.SET_SMS_STEP: {
      return {
        ...state,
        smsStep: Remote.Success(action.payload.step)
      }
    }
    case AT.SET_EMAIL_STEP: {
      return {
        ...state,
        emailStep: action.payload.step
      }
    }
    case AT.SET_SUPPORTED_COUNTRIES_LOADING: {
      return {
        ...state,
        supportedCountries: Remote.Loading
      }
    }
    case AT.SET_SUPPORTED_COUNTRIES_SUCCESS: {
      return {
        ...state,
        supportedCountries: Remote.Success(action.payload.countries)
      }
    }
    case AT.SET_SUPPORTED_COUNTRIES_FAILURE: {
      return {
        ...state,
        supportedCountries: Remote.Failure(action.payload.e)
      }
    }
    case AT.SET_SUPPORTED_DOCUMENTS_LOADING: {
      return {
        ...state,
        supportedDocuments: Remote.Loading
      }
    }
    case AT.SET_SUPPORTED_DOCUMENTS_SUCCESS: {
      return {
        ...state,
        supportedDocuments: Remote.Success(action.payload.documentTypes)
      }
    }
    case AT.SET_SUPPORTED_DOCUMENTS_FAILURE: {
      return {
        ...state,
        supportedDocuments: Remote.Failure(action.payload.e)
      }
    }
    case AT.SET_STATES_LOADING: {
      return {
        ...state,
        states: Remote.Loading
      }
    }
    case AT.SET_STATES_SUCCESS: {
      return {
        ...state,
        states: Remote.Success(action.payload.states)
      }
    }
    case AT.SET_STATES_FAILURE: {
      return {
        ...state,
        states: Remote.Failure(action.payload.e)
      }
    }
    case AT.SET_KYC_FLOW_LOADING: {
      return {
        ...state,
        flowConfig: Remote.Loading
      }
    }
    case AT.SET_KYC_FLOW_SUCCESS: {
      return {
        ...state,
        flowConfig: Remote.Success(action.payload.flowConfig)
      }
    }
    case AT.SET_KYC_FLOW_FAILURE: {
      return {
        ...state,
        flowConfig: Remote.Failure(action.payload.e)
      }
    }
    case AT.SET_PRE_IDV_DATA_SUCCESS: {
      return {
        ...state,
        preIdvData: Remote.Success(action.payload.preIdvData)
      }
    }
    case AT.SET_PRE_IDV_DATA_FAILURE: {
      return {
        ...state,
        preIdvData: Remote.Failure(action.payload.e)
      }
    }
    case AT.SET_STEPS_LOADING: {
      return {
        ...state,
        steps: Remote.Loading
      }
    }
    case AT.SET_STEPS_FAILURE: {
      return {
        ...state,
        steps: Remote.Failure(action.payload.e)
      }
    }
    case AT.SET_STEPS_SUCCESS: {
      return {
        ...state,
        steps: Remote.Success(action.payload.steps)
      }
    }
    default:
      return state
  }
}

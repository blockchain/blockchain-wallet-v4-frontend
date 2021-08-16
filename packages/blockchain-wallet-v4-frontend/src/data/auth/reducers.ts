import { assoc } from 'ramda'

import { Remote } from 'blockchain-wallet-v4/src'

import * as AT from './actionTypes'

const INITIAL_STATE = {
  auth_type: 0,
  firstLogin: false,
  isAuthenticated: false,
  isLoggingIn: false,
  kycReset: undefined,
  login: Remote.NotAsked,
  magicLinkData: null,
  metadataRestore: Remote.NotAsked,
  mobileLoginStarted: false,
  registerEmail: undefined,
  registering: Remote.NotAsked,
  resetAccount: false,
  restoring: Remote.NotAsked,
  secureChannelLogin: Remote.NotAsked,
  userGeoData: Remote.NotAsked
}

const auth = (state = INITIAL_STATE, action) => {
  const { payload, type } = action

  switch (type) {
    case AT.CLEAR_LOGIN_ERROR: {
      return assoc('login', Remote.NotAsked, state)
    }
    case AT.LOGIN: {
      return assoc('isLoggingIn', true, state)
    }
    case AT.LOGIN_LOADING: {
      return assoc('login', Remote.Loading, state)
    }
    case AT.LOGIN_SUCCESS: {
      return assoc('login', Remote.Success(payload), state)
    }
    case AT.LOGIN_FAILURE: {
      return assoc('login', Remote.Failure(payload), state)
    }
    case AT.AUTHENTICATE: {
      return assoc('isAuthenticated', true, state)
    }
    case AT.SET_KYC_RESET: {
      return assoc('kycReset', payload.kycResetStatus, state)
    }
    case AT.MOBILE_LOGIN_START: {
      return assoc('mobileLoginStarted', true, state)
    }
    case AT.MOBILE_LOGIN_FINISH: {
      return assoc('mobileLoginStarted', false, state)
    }
    case AT.REGISTER_LOADING: {
      return assoc('registering', Remote.Loading, state)
    }
    case AT.REGISTER_SUCCESS: {
      return assoc('registering', Remote.Success(payload), state)
    }
    case AT.REGISTER_FAILURE: {
      return assoc('registering', Remote.Failure(payload), state)
    }
    case AT.RESTORE_LOADING: {
      return assoc('restoring', Remote.Loading, state)
    }
    case AT.RESTORE_SUCCESS: {
      return assoc('restoring', Remote.Success(payload), state)
    }
    case AT.RESTORE_FAILURE: {
      return assoc('restoring', Remote.Failure(payload), state)
    }
    case AT.SECURE_CHANNEL_LOGIN_LOADING: {
      return assoc('secureChannelLogin', Remote.Loading, state)
    }
    case AT.SECURE_CHANNEL_LOGIN_SUCCESS: {
      return assoc('secureChannelLogin', Remote.Success(payload), state)
    }
    case AT.SECURE_CHANNEL_LOGIN_FAILURE: {
      return assoc('secureChannelLogin', Remote.Failure(payload), state)
    }
    case AT.SECURE_CHANNEL_LOGIN_NOTASKED: {
      return assoc('secureChannelLogin', Remote.NotAsked, state)
    }
    case AT.SET_FIRST_LOGIN: {
      return assoc('firstLogin', payload.firstLogin, state)
    }
    case AT.SET_RESET_ACCOUNT: {
      return assoc('resetAccount', payload.resetAccount, state)
    }
    case AT.SET_AUTH_TYPE: {
      const { authType } = payload
      return assoc('auth_type', authType, state)
    }
    case AT.SET_MAGIC_LINK_INFO: {
      return {
        ...state,
        magicLinkData: action.payload.magicLinkInfo
      }
    }
    case AT.SET_REGISTER_EMAIL: {
      const { email } = payload
      return {
        ...state,
        registerEmail: email
      }
    }
    case AT.RESTORE_FROM_METADATA_LOADING: {
      return assoc('metadataRestore', Remote.Loading, state)
    }
    case AT.RESTORE_FROM_METADATA_SUCCESS: {
      return assoc('metadataRestore', Remote.Success(payload), state)
    }
    case AT.RESTORE_FROM_METADATA_FAILURE: {
      return assoc('metadataRestore', Remote.Failure(payload), state)
    }
    case AT.SET_USER_GEO_LOCATION: {
      const { userGeoData } = payload
      return assoc('userGeoData', userGeoData, state)
    }
    default:
      return state
  }
}

export default auth

import * as AT from './actionTypes'
import { AuthActionTypes } from './types'

// LOGIN
export const login = (guid, password, code, sharedKey, mobileLogin) => ({
  payload: { code, guid, mobileLogin, password, sharedKey },
  type: AT.LOGIN
})
export const loginLoading = () => ({ type: AT.LOGIN_LOADING })
export const loginSuccess = () => ({ payload: {}, type: AT.LOGIN_SUCCESS })
export const loginFailure = (err) => ({
  payload: { err },
  type: AT.LOGIN_FAILURE
})
export const setFirstLogin = (firstLogin) => ({
  payload: { firstLogin },
  type: AT.SET_FIRST_LOGIN
})

// LOGOUT
export const logout = () => ({ type: AT.LOGOUT })
export const logoutClearReduxStore = () => ({
  type: AT.LOGOUT_CLEAR_REDUX_STORE
})
export const startLogoutTimer = () => ({ type: AT.START_LOGOUT_TIMER })

// MOBILE LOGIN
export const mobileLogin = (data) => ({
  payload: { data },
  type: AT.MOBILE_LOGIN
})
export const mobileLoginStarted = () => ({ type: AT.MOBILE_LOGIN_START })
export const mobileLoginFinish = () => ({ type: AT.MOBILE_LOGIN_FINISH })

// REGISTER
export const register = (email, password, language) => ({
  payload: { email, language, password },
  type: AT.REGISTER
})
export const registerLoading = () => ({ type: AT.REGISTER_LOADING })
export const registerSuccess = () => ({ type: AT.REGISTER_SUCCESS })
export const registerFailure = () => ({ type: AT.REGISTER_FAILURE })

// 2FA
export const resendSmsCode = (guid) => ({
  payload: { guid },
  type: AT.RESEND_SMS_CODE
})

// WALLET RESTORE
export const restore = (mnemonic, email, password, language, network) => ({
  payload: { email, language, mnemonic, network, password },
  type: AT.RESTORE
})
export const restoreLoading = () => ({ type: AT.RESTORE_LOADING })
export const restoreSuccess = () => ({ type: AT.RESTORE_SUCCESS })
export const restoreFailure = () => ({ type: AT.RESTORE_FAILURE })

// WALLET RESTORE FROM METADATA
export const restoreFromMetadata = (mnemonic) => ({
  payload: { mnemonic },
  type: AT.RESTORE_FROM_METADATA
})
export const restoreFromMetadataLoading = () => ({
  type: AT.RESTORE_FROM_METADATA_LOADING
})
export const restoreFromMetadataSuccess = (payload) => ({
  payload,
  type: AT.RESTORE_FROM_METADATA_SUCCESS
})
export const restoreFromMetadataFailure = (err) => ({
  payload: err,
  type: AT.RESTORE_FROM_METADATA_FAILURE
})

// MOBILE AUTH CHANNEL LOGIN
export const secureChannelLoginLoading = () => ({
  type: AT.SECURE_CHANNEL_LOGIN_LOADING
})
export const secureChannelLoginSuccess = () => ({
  type: AT.SECURE_CHANNEL_LOGIN_SUCCESS
})
export const secureChannelLoginNotAsked = () => ({
  type: AT.SECURE_CHANNEL_LOGIN_NOTASKED
})
export const secureChannelLoginFailure = (err) => ({
  payload: { err },
  type: AT.SECURE_CHANNEL_LOGIN_FAILURE
})

// MISC
export const authenticate = () => ({ type: AT.AUTHENTICATE })
export const deauthorizeBrowser = () => ({ type: AT.DEAUTHORIZE_BROWSER })
export const setAuthType = (authType) => ({
  payload: { authType },
  type: AT.SET_AUTH_TYPE
})
export const setRegisterEmail = (email) => ({
  payload: { email },
  type: AT.SET_REGISTER_EMAIL
})
export const upgradeWallet = (version: number): AuthActionTypes => ({
  payload: { version },
  type: AT.UPGRADE_WALLET
})

export const clearLoginError = () => ({
  type: AT.CLEAR_LOGIN_ERROR
})

// INITIALIZE LOGIN
export const initializeLogin = () => ({
  type: AT.INTIALIZE_LOGIN
})

export const initializeLoginLoading = (): AuthActionTypes => ({
  type: AT.INTIALIZE_LOGIN_LOADING
})

export const initializeLoginSuccess = (): AuthActionTypes => ({
  type: AT.INTIALIZE_LOGIN_SUCCESS
})

export const initializeLoginFailure = (): AuthActionTypes => ({
  type: AT.INTIALIZE_LOGIN_FAILURE
})

// LOGIN GUID
export const loginGuid = (email: string, captchaToken?: string) => ({
  payload: { captchaToken, email },
  type: AT.LOGIN_GUID
})
export const loginGuidLoading = (): AuthActionTypes => ({
  type: AT.LOGIN_GUID_LOADING
})
export const loginGuidSuccess = (): AuthActionTypes => ({
  type: AT.LOGIN_GUID_SUCCESS
})
export const loginGuidFailure = (): AuthActionTypes => ({
  type: AT.LOGIN_GUID_FAILURE
})
export const loginGuidNotAsked = () => ({ type: AT.LOGIN_GUID_NOTASKED })

// FIRST GUID SUBMISSION
export const guidWallet = (guid: string) => ({
  payload: { guid },
  type: AT.GUID_WALLET
})

export const guidWalletLoading = (): AuthActionTypes => ({
  type: AT.GUID_WALLET_LOADING
})

export const guidWalletSuccess = (): AuthActionTypes => ({
  type: AT.GUID_WALLET_SUCCESS
})

export const guidWalletFailure = (): AuthActionTypes => ({
  type: AT.GUID_WALLET_FAILURE
})

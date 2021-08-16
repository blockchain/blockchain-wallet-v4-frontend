import * as AT from './actionTypes'
import { AuthActionTypes, WalletDataFromMagicLink } from './types'

// LOGIN
export const login = (guid, password, code, sharedKey, mobileLogin) => ({
  payload: { code, guid, mobileLogin, password, sharedKey },
  type: AT.LOGIN
})
export const loginLoading = () => ({ type: AT.LOGIN_LOADING })
export const loginSuccess = () => ({ payload: {}, type: AT.LOGIN_SUCCESS })
export const loginFailure = (err?: string): AuthActionTypes => ({
  payload: { err },
  type: AT.LOGIN_FAILURE
})
export const setFirstLogin = (firstLogin) => ({
  payload: { firstLogin },
  type: AT.SET_FIRST_LOGIN
})

export const loginRoutine = (
  email?: string,
  firstLogin?: boolean,
  mobileLogin?: boolean
): AuthActionTypes => ({
  payload: {
    email,
    firstLogin,
    mobileLogin
  },
  type: AT.LOGIN_ROUTINE_SAGA
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
export const register = (
  email: string,
  password: string,
  language: string,
  country?: string,
  state?: string
) => ({
  payload: { country, email, language, password, state },
  type: AT.REGISTER
})
export const registerLoading = () => ({ type: AT.REGISTER_LOADING })
export const registerSuccess = () => ({ type: AT.REGISTER_SUCCESS })
export const registerFailure = () => ({ type: AT.REGISTER_FAILURE })

// RESET ACCOUNT (ASSIGN NABU ACCOUNT TO NEW WALLET)
export const resetAccount = (email, password, language) => ({
  payload: { email, language, password },
  type: AT.RESET_ACCOUNT
})
export const resetAccountLoading = () => ({ type: AT.RESET_ACCOUNT_LOADING })
export const resetAccountSuccess = () => ({ type: AT.RESET_ACCOUNT_SUCCESS })
export const resetAccountFailure = () => ({ type: AT.RESET_ACCOUNT_FAILURE })
export const setResetAccount = (resetAccount) => ({
  payload: { resetAccount },
  type: AT.SET_RESET_ACCOUNT
})
// 2FA
export const resendSmsCode = (guid, email) => ({
  payload: { email, guid },
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

// LOGIN
export const clearLoginError = () => ({
  type: AT.CLEAR_LOGIN_ERROR
})

export const setMagicLinkInfo = (magicLinkInfo: WalletDataFromMagicLink): AuthActionTypes => ({
  payload: { magicLinkInfo },
  type: AT.SET_MAGIC_LINK_INFO
})

// INITIALIZE LOGIN
export const initializeLogin = () => ({
  type: AT.INITIALIZE_LOGIN
})

export const initializeLoginLoading = (): AuthActionTypes => ({
  type: AT.INITIALIZE_LOGIN_LOADING
})

export const initializeLoginSuccess = (): AuthActionTypes => ({
  type: AT.INITIALIZE_LOGIN_SUCCESS
})

export const initializeLoginFailure = (): AuthActionTypes => ({
  type: AT.INITIALIZE_LOGIN_FAILURE
})

// LOGIN GUID
export const triggerWalletMagicLink = (email: string, captchaToken?: string) => ({
  payload: { captchaToken, email },
  type: AT.TRIGGER_WALLET_MAGIC_LINK
})
export const triggerWalletMagicLinkLoading = (): AuthActionTypes => ({
  type: AT.TRIGGER_WALLET_MAGIC_LINK_LOADING
})
export const triggerWalletMagicLinkSuccess = (): AuthActionTypes => ({
  type: AT.TRIGGER_WALLET_MAGIC_LINK_SUCCESS
})
export const triggerWalletMagicLinkFailure = (): AuthActionTypes => ({
  type: AT.TRIGGER_WALLET_MAGIC_LINK_FAILURE
})
export const triggerWalletMagicLinkNotAsked = () => ({
  type: AT.TRIGGER_WALLET_MAGIC_LINK_NOTASKED
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

export const logWrongChangeCache = () => ({
  type: AT.WRONG_CHANGE_CACHE
})
export const logWrongReceiveCache = () => ({
  type: AT.WRONG_RECEIVE_CACHE
})

export const setKycResetStatus = (kycResetStatus) => ({
  payload: { kycResetStatus },
  type: AT.SET_KYC_RESET
})
export const getUserGeoLocation = () => ({
  type: AT.GET_USER_GEO_LOCATION
})
export const setUserGeoLocation = (userGeoData) => ({
  payload: { userGeoData },
  type: AT.SET_USER_GEO_LOCATION
})

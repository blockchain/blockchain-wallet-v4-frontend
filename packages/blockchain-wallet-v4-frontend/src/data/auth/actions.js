import * as AT from './actionTypes'

// LOGIN
export const login = (guid, password, code, sharedKey, mobileLogin) => ({
  type: AT.LOGIN,
  payload: { guid, password, code, sharedKey, mobileLogin }
})
export const loginLoading = () => ({ type: AT.LOGIN_LOADING })
export const loginSuccess = () => ({ type: AT.LOGIN_SUCCESS, payload: {} })
export const loginFailure = err => ({
  type: AT.LOGIN_FAILURE,
  payload: { err }
})
export const setFirstLogin = firstLogin => ({
  type: AT.SET_FIRST_LOGIN,
  payload: { firstLogin }
})

// LOGOUT
export const logout = () => ({ type: AT.LOGOUT })
export const logoutClearReduxStore = () => ({
  type: AT.LOGOUT_CLEAR_REDUX_STORE
})
export const startLogoutTimer = () => ({ type: AT.START_LOGOUT_TIMER })

// MOBILE LOGIN
export const mobileLogin = data => ({
  type: AT.MOBILE_LOGIN,
  payload: { data }
})
export const mobileLoginStarted = () => ({ type: AT.MOBILE_LOGIN_START })
export const mobileLoginFinish = () => ({ type: AT.MOBILE_LOGIN_FINISH })

// REGISTER
export const register = (email, password, language) => ({
  type: AT.REGISTER,
  payload: { email, password, language }
})
export const registerLoading = () => ({ type: AT.REGISTER_LOADING })
export const registerSuccess = () => ({ type: AT.REGISTER_SUCCESS })
export const registerFailure = () => ({ type: AT.REGISTER_FAILURE })

// REMIND GUID
export const remindGuid = (email, code, sessionToken) => ({
  type: AT.REMIND_GUID,
  payload: { email, code, sessionToken }
})
export const remindGuidLoading = () => ({ type: AT.REMIND_GUID_LOADING })
export const remindGuidSuccess = () => ({ type: AT.REMIND_GUID_SUCCESS })
export const remindGuidFailure = () => ({ type: AT.REMIND_GUID_FAILURE })
export const remindGuidNotAsked = () => ({ type: AT.REMIND_GUID_NOTASKED })

// 2FA
export const resendSmsCode = guid => ({
  type: AT.RESEND_SMS_CODE,
  payload: { guid }
})
export const reset2fa = (
  guid,
  email,
  newEmail,
  secretPhrase,
  message,
  code,
  sessionToken
) => ({
  type: AT.RESET_2FA,
  payload: { guid, email, newEmail, secretPhrase, message, code, sessionToken }
})
export const reset2faLoading = () => ({ type: AT.RESET_2FA_LOADING })
export const reset2faSuccess = () => ({ type: AT.RESET_2FA_SUCCESS })
export const reset2faFailure = err => ({
  type: AT.RESET_2FA_FAILURE,
  payload: { err }
})

// WALLET RESTORE
export const restore = (mnemonic, email, password, language, network) => ({
  type: AT.RESTORE,
  payload: { mnemonic, email, password, language, network }
})
export const restoreLoading = () => ({ type: AT.RESTORE_LOADING })
export const restoreSuccess = () => ({ type: AT.RESTORE_SUCCESS })
export const restoreFailure = () => ({ type: AT.RESTORE_FAILURE })

// WALLET RESTORE FROM METADATA
export const restoreFromMetadata = mnemonic => ({
  type: AT.RESTORE_FROM_METADATA,
  payload: { mnemonic }
})
export const restoreFromMetadataLoading = () => ({
  type: AT.RESTORE_FROM_METADATA_LOADING
})
export const restoreFromMetadataSuccess = payload => ({
  type: AT.RESTORE_FROM_METADATA_SUCCESS,
  payload
})
export const restoreFromMetadataFailure = err => ({
  type: AT.RESTORE_FROM_METADATA_FAILURE,
  payload: err
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
export const secureChannelLoginFailure = err => ({
  type: AT.SECURE_CHANNEL_LOGIN_FAILURE,
  payload: { err }
})

// MISC
export const authenticate = () => ({ type: AT.AUTHENTICATE })
export const deauthorizeBrowser = () => ({ type: AT.DEAUTHORIZE_BROWSER })
export const setAuthType = authType => ({
  type: AT.SET_AUTH_TYPE,
  payload: { authType }
})
export const upgradeWallet = () => ({ type: AT.UPGRADE_WALLET, payload: {} })
export const setRegisterEmail = email => ({
  type: AT.SET_REGISTER_EMAIL,
  payload: { email }
})

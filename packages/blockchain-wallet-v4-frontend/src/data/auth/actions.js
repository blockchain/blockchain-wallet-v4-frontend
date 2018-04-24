import * as AT from './actionTypes'

export const login = (guid, password, code, sharedKey, mobileLogin) => ({ type: AT.LOGIN, payload: { guid, password, code, sharedKey, mobileLogin } })

export const mobileLogin = (data) => ({ type: AT.MOBILE_LOGIN, payload: { data } })

export const setAuthType = (authType) => ({ type: AT.SET_AUTH_TYPE, payload: { authType } })

export const register = (email, password) => ({ type: AT.REGISTER, payload: { email, password } })

export const restore = (mnemonic, email, password, network) => ({ type: AT.RESTORE, payload: { mnemonic, email, password, network } })

export const remindGuid = (email, code, sessionToken) => ({ type: AT.REMIND_GUID, payload: { email, code, sessionToken } })

export const authenticate = () => ({ type: AT.AUTHENTICATE })

export const logout = () => ({ type: AT.LOGOUT })

export const startLogoutTimer = () => ({ type: AT.START_LOGOUT_TIMER })

export const reset2fa = (guid, email, newEmail, secretPhrase, message, code, sessionToken) => ({ type: AT.RESET_2FA, payload: { guid, email, newEmail, secretPhrase, message, code, sessionToken } })

export const upgradeWallet = () => ({ type: AT.UPGRADE_WALLET, payload: {} })

export const setError = (message) => ({ type: AT.SET_AUTH_ERROR, payload: { message } })
export const clearError = () => ({ type: AT.CLEAR_ERROR })

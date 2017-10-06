import * as AT from './actionTypes'

export const login = (guid, password, code) => ({ type: AT.LOGIN, payload: { guid, password, code } })

export const register = (email, password) => ({ type: AT.REGISTER, payload: { email, password } })

export const restore = (mnemonic, email, password, network) => ({ type: AT.RESTORE, payload: { mnemonic, email, password, network } })

export const remindGuid = (email, code, sessionToken) => ({ type: AT.REMIND_GUID, payload: { email, code, sessionToken } })

export const authenticate = () => ({ type: AT.AUTHENTICATE })

export const logout = () => ({ type: AT.LOGOUT })

export const logoutResetTimer = () => ({ type: AT.LOGOUT_RESET_TIMER })

//
export const setAuthType = (authType) => ({ type: AT.SET_AUTH_TYPE, payload: { authType } })

export const mobileLoginSuccess = (data) => ({ type: AT.MOBILE_LOGIN_SUCCESS, payload: { data } })

export const mobileLoginError = (message) => ({ type: AT.MOBILE_LOGIN_ERROR, payload: message })

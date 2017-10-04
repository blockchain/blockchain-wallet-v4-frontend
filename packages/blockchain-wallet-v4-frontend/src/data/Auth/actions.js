import * as AT from './actionTypes'

export const login = (guid, password) => ({ type: AT.LOGIN, payload: { guid, password } })

export const register = (email, password) => ({ type: AT.REGISTER, payload: { email, password } })

export const restore = (mnemonic, email, password, network) => ({ type: AT.RESTORE, payload: { mnemonic, email, password, network } })

//
export const loginSuccess = () => ({ type: AT.LOGIN_SUCCESS })

export const loginError = (payload) => ({ type: AT.LOGIN_ERROR, payload })

export const saveSession = (payload) => ({ type: AT.SAVE_SESSION, payload })

export const logoutStartTimer = (duration) => ({ type: AT.LOGOUT_START_TIMER, payload: { duration } })

export const logoutResetTimer = () => ({ type: AT.LOGOUT_RESET_TIMER })

export const logoutStart = () => ({ type: AT.LOGOUT_START })

export const logoutCancel = () => ({ type: AT.LOGOUT_CANCEL })

export const setAuthType = (authType) => ({ type: AT.SET_AUTH_TYPE, payload: { authType } })

export const mobileLoginSuccess = (data) => ({ type: AT.MOBILE_LOGIN_SUCCESS, payload: { data } })

export const mobileLoginError = (message) => ({ type: AT.MOBILE_LOGIN_ERROR, payload: message })

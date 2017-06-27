import * as AT from './actionTypes'

export const loginStart = (credentials) => ({ type: AT.LOGIN_START, payload: credentials })

export const loginSuccess = () => ({ type: AT.LOGIN_SUCCESS })

export const loginError = (payload) => ({ type: AT.LOGIN_ERROR, payload, error: true })

export const saveSession = (payload) => ({ type: AT.SAVE_SESSION, payload })

export const autoLogoutStart = () => ({ type: AT.AUTOLOGOUT_START })

export const logoutStart = () => ({ type: AT.LOGOUT_START })

export const logoutCancel = () => ({ type: AT.LOGOUT_CANCEL })

import * as AT from './actionTypes'

export const loginStart = (payload) => ({ type: AT.LOGIN_START, payload })

export const loginSuccess = () => ({ type: AT.LOGIN_SUCCESS })

export const loginError = (payload) => ({ type: AT.LOGIN_ERROR, payload, error: true })

export const saveSession = (payload) => ({ type: AT.SAVE_SESSION, payload })

export const logoutStartTimer = (duration) => ({ type: AT.LOGOUT_START_TIMER, payload: { duration } })

export const logoutResetTimer = () => ({ type: AT.LOGOUT_RESET_TIMER })

export const logoutStart = () => ({ type: AT.LOGOUT_START })

export const logoutCancel = () => ({ type: AT.LOGOUT_CANCEL })

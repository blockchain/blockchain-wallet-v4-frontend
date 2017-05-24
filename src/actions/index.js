import * as AT from './actionTypes'

export const loginStart = credentials => ({ type: AT.LOGIN_START, payload: credentials })
export const loginSuccess = () => ({ type: AT.LOGIN_SUCCESS })
export const loginError = payload => ({ type: AT.LOGIN_ERROR, payload, error: true })

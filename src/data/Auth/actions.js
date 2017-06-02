import { LOGIN_START, LOGIN_SUCCESS, LOGIN_ERROR, SAVE_SESSION } from 'data/actionTypes'

export const loginStart = (credentials) => ({ type: LOGIN_START, payload: credentials })
export const loginSuccess = () => ({ type: LOGIN_SUCCESS })
export const loginError = (payload) => ({ type: LOGIN_ERROR, payload, error: true })
export const saveSession = (payload) => ({ type: SAVE_SESSION, payload })

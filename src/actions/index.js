import * as AT from './actionTypes'

export const loginStart = credentials => ({ type: AT.LOGIN_START, payload: credentials })
export const loginSuccess = () => ({ type: AT.LOGIN_SUCCESS })
export const loginError = payload => ({ type: AT.LOGIN_ERROR, payload, error: true })

export const saveSession = (payload) => ({ type: AT.SAVE_SESSION, payload })

export const secondPasswordError = (payload) => ({ type: SECOND_PASSWORD_ERROR, payload, error: true })
export const inconsistentWalletStateError = (payload) => ({ type: INCONSISTENT_WALLET_STATE_ERROR, payload, error: true })

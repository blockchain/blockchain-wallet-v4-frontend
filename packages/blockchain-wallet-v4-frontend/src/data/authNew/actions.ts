import * as AT from './actionTypes'
import { AuthNewActionTypes } from './types'

// INITIALIZE LOGIN
export const initializeLogin = () => ({
  type: AT.INTIALIZE_LOGIN
})

export const intializeLoginLoading = (): AuthNewActionTypes => ({
  type: AT.INTIALIZE_LOGIN_LOADING
})

export const initializeLoginSuccess = (): AuthNewActionTypes => ({
  type: AT.INTIALIZE_LOGIN_SUCCESS
})

export const intializeLoginFailure = (): AuthNewActionTypes => ({
  type: AT.INTIALIZE_LOGIN_FAILURE
})

// LOGIN GUID
export const loginGuid = (email: string) => ({
  type: AT.LOGIN_GUID,
  payload: { email }
})
export const loginGuidLoading = (): AuthNewActionTypes => ({
  type: AT.LOGIN_GUID_LOADING
})
export const loginGuidSuccess = (): AuthNewActionTypes => ({
  type: AT.LOGIN_GUID_SUCCESS
})
export const loginGuidFailure = (): AuthNewActionTypes => ({
  type: AT.LOGIN_GUID_FAILURE
})
export const loginGuidNotAsked = () => ({ type: AT.LOGIN_GUID_NOTASKED })

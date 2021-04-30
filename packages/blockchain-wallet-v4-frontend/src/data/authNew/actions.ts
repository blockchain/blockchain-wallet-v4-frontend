import * as AT from './actionTypes'
import { AuthNewActionTypes } from './types'

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

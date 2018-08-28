import * as AT from './actionTypes'

export const setUserData = userData => ({
  type: AT.SET_USER_DATA,
  payload: { userData }
})
export const setApiToken = token => ({
  type: AT.SET_API_TOKEN,
  payload: { token }
})

export const signIn = () => ({
  type: AT.SIGN_IN
})
export const clearSession = () => ({
  type: AT.CLEAR_SESSION
})
export const generateAuthCredentials = () => ({
  type: AT.GENERATE_AUTH_CREDENTIALS
})

export const fetchUser = () => ({
  type: AT.FETCH_USER
})

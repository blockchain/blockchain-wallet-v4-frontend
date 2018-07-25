import * as AT from './actionTypes'

export const setUserData = userData => ({
  type: AT.SET_USER_DATA,
  payload: { userData }
})

export const signIn = () => ({
  type: AT.SIGN_IN
})

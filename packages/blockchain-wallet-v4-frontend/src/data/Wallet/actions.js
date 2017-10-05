import * as T from './actionTypes'

export const toggleSecondPassword = (password) =>
  ({ type: T.TOGGLE_SECOND_PASSWORD, payload: { password } })

export const updatePbkdf2Iterations = (iterations) =>
  ({ type: T.UPDATE_PBKDF2_ITERATIONS, payload: { iterations } })

export const submitSecondPassword = (password) =>
  ({ type: T.SUBMIT_SECOND_PASSWORD, payload: { password } })

export const createLegacyAddress = (address) =>
  ({ type: T.CREATE_LEGACY_ADDRESS, payload: { address } })

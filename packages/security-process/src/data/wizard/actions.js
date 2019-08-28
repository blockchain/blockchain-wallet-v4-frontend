import * as AT from './actionTypes'

export const setStep = (name, step) => ({
  type: AT.SET_STEP,
  payload: { name, step }
})

export const reset = name => ({ type: AT.RESET_STEP, payload: { name } })

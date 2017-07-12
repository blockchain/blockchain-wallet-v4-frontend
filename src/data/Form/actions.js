import * as AT from './actionTypes'

export const setStep = (formName, step) => ({ type: AT.SET_STEP, payload: { formName, step } })

import * as AT from './actionTypes'

export const setBankManually = (routing, account, name, type) => ({ type: AT.SET_BANK_MANUALLY, payload: { routing, account, name, type } })

export const sfoxSignup = () => ({ type: AT.SIGNUP })
export const signupFailure = (error) => ({ type: AT.SIGNUP_FAILURE, payload: error })

export const nextStep = (step) => ({ type: AT.NEXT_STEP, payload: step })

export const setProfile = (user) => ({ type: AT.SET_PROFILE, payload: user })

export const upload = (uploadData) => ({ type: AT.UPLOAD, payload: uploadData })

export const clearSignupError = () => ({ type: AT.CLEAR_SIGNUP_ERROR })

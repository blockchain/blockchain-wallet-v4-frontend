import * as AT from './actionTypes'

export const setBankManually = (routing, account, name, type) => ({ type: AT.SET_BANK_MANUALLY, payload: { routing, account, name, type } })

export const signup = () => ({ type: AT.SIGNUP })

export const nextStep = (step) => ({ type: AT.NEXT_STEP, payload: step })

export const setProfile = (user) => ({ type: AT.SET_PROFILE, payload: user })

import * as AT from './actionTypes'

export const setBankManually = (routing, account, name, type) => ({ type: AT.SET_BANK_MANUALLY, payload: { routing, account, name, type } })

export const signup = () => ({ type: AT.SIGNUP })

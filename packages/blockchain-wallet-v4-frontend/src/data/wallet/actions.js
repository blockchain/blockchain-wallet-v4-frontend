import * as AT from './actionTypes'

export const addWallet = (label) => ({ type: AT.ADD_WALLET, payload: { label } })

export const toggleSecondPassword = (password) => ({ type: AT.TOGGLE_SECOND_PASSWORD, payload: { password } })

export const updatePbkdf2Iterations = (iterations) => ({ type: AT.UPDATE_PBKDF2_ITERATIONS, payload: { iterations } })

export const submitSecondPassword = (password) => ({ type: AT.SUBMIT_SECOND_PASSWORD, payload: { password } })

export const createLegacyAddress = (address) => ({ type: AT.CREATE_LEGACY_ADDRESS, payload: { address } })

export const setArchivedAddress = (address) => ({ type: AT.SET_ARCHIVED_ADDRESS, payload: { address } })

export const verifyMnemonic = () => ({ type: AT.VERIFY_MNEMONIC })

import * as AT from './actionTypes'

export const toggleSecondPassword = (password) => ({ type: AT.TOGGLE_SECOND_PASSWORD, payload: { password } })

export const updatePbkdf2Iterations = (iterations) => ({ type: AT.UPDATE_PBKDF2_ITERATIONS, payload: { iterations } })

export const submitSecondPassword = (password) => ({ type: AT.SUBMIT_SECOND_PASSWORD, payload: { password } })

export const importLegacyAddress = (addr, priv, to, bipPass) => ({ type: AT.IMPORT_LEGACY_ADDRESS, payload: { addr, priv, to, bipPass } })

export const verifyMnemonic = () => ({ type: AT.VERIFY_MNEMONIC })

export const editHdLabel = (accountIdx, addressIdx) => ({ type: AT.EDIT_HD_LABEL, payload: { accountIdx, addressIdx } })

export const submitPromptInput = (value) => ({ type: AT.SUBMIT_PROMPT_INPUT, payload: { value } })

export const editAccountLabel = (index, label) => ({ type: AT.EDIT_ACCOUNT_LABEL, payload: { index, label } })

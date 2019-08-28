import * as AT from './actionTypes'

export const toggleSecondPassword = (password, secondPasswordEnabled) => ({
  type: AT.TOGGLE_SECOND_PASSWORD,
  payload: { password, secondPasswordEnabled }
})

export const updatePbkdf2Iterations = iterations => ({
  type: AT.UPDATE_PBKDF2_ITERATIONS,
  payload: { iterations }
})

export const submitSecondPassword = password => ({
  type: AT.SUBMIT_SECOND_PASSWORD,
  payload: { password }
})

export const importLegacyAddress = (addr, priv, to, bipPass) => ({
  type: AT.IMPORT_LEGACY_ADDRESS,
  payload: { addr, priv, to, bipPass }
})

export const verifyMnemonic = () => ({ type: AT.VERIFY_MNEMONIC })

export const submitPromptInput = value => ({
  type: AT.SUBMIT_PROMPT_INPUT,
  payload: { value }
})

export const submitConfirmation = value => ({
  type: AT.SUBMIT_CONFIRMATION,
  payload: { value: true }
})

export const editBtcAccountLabel = (index, label) => ({
  type: AT.EDIT_BTC_ACCOUNT_LABEL,
  payload: { index, label }
})

export const setMainPassword = password => ({
  type: AT.SET_MAIN_PASSWORD,
  payload: { password }
})

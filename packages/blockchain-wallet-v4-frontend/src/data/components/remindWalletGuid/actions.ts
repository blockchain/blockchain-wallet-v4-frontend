import * as AT from './actionTypes'

export const remindWalletGuid = (captchaToken, email) => ({
  payload: { captchaToken, email },
  type: AT.REMIND_WALLET_GUID
})
export const remindLoading = () => ({ type: AT.REMIND_WALLET_GUID_LOADING })
export const remindSuccess = (payload?) => ({ payload, type: AT.REMIND_WALLET_GUID_SUCCESS })
export const remindFailure = (e) => ({
  payload: e,
  type: AT.REMIND_WALLET_GUID_FAILURE
})
export const resetForm = () => ({ type: AT.REMIND_WALLET_GUID_NOTASKED })

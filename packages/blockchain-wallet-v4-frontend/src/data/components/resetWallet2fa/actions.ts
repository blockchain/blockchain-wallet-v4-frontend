import * as AT from './actionTypes'

export const resetWallet2fa = (captchaToken, formValues) => ({
  payload: { captchaToken, formValues },
  type: AT.RESET_WALLET_2FA
})
export const resetLoading = () => ({ type: AT.RESET_WALLET_2FA_LOADING })
export const resetSuccess = (payload?) => ({ payload, type: AT.RESET_WALLET_2FA_SUCCESS })
export const resetFailure = (e) => ({
  payload: e,
  type: AT.RESET_WALLET_2FA_FAILURE
})
export const resetForm = () => ({ type: AT.RESET_WALLET_2FA_NOTASKED })

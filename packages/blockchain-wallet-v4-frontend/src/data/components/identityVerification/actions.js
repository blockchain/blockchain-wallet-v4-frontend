import * as AT from './actionTypes'

export const setOnfidoEnabled = enabled => ({
  type: AT.SET_ONFIDO_ENABLED,
  payload: { enabled }
})
export const setVertificationStep = step => ({
  type: AT.SET_VERIFICATION_STEP,
  payload: { step }
})
export const setPersonalStep = step => ({
  type: AT.SET_PERSONAL_STEP,
  payload: { step }
})
export const setEmailStep = step => ({
  type: AT.SET_EMAIL_STEP,
  payload: { step }
})
export const setSmsStep = step => ({ type: AT.SET_SMS_STEP, payload: { step } })

export const updatePersonalStep = payload => ({
  type: AT.UPDATE_PERSONAL_STEP,
  payload
})
export const updateEmail = () => ({ type: AT.UPDATE_EMAIL })
export const verifyEmail = () => ({ type: AT.VERIFY_EMAIL })
export const resendEmailCode = () => ({ type: AT.RESEND_EMAIL_CODE })
export const updateSmsNumber = () => ({ type: AT.UPDATE_SMS_NUMBER })
export const verifySmsNumber = () => ({ type: AT.VERIFY_SMS_NUMBER })
export const resendSmsCode = () => ({ type: AT.RESEND_SMS_CODE })
export const setFormBusy = busy => ({
  type: AT.SET_FORM_BUSY,
  payload: { busy }
})

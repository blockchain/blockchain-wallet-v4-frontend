import * as AT from './actionTypes'

export const updateEmail = (email, confirmationCode) => ({
  payload: { confirmationCode, email },
  type: AT.UPDATE_EMAIL
})

export const verifyEmail = (code) => ({
  payload: { code },
  type: AT.VERIFY_EMAIL
})

export const verifyEmailCode = (code) => ({
  payload: { code },
  type: AT.VERIFY_EMAIL_CODE
})

export const sendConfirmationCodeEmail = (email) => ({
  payload: { email },
  type: AT.SEND_CONFIRMATION_CODE_EMAIL
})

export const resendVerifyEmail = (email) => ({
  payload: { email },
  type: AT.RESEND_VERIFY_EMAIL
})

export const getGoogleAuthenticatorSecretUrl = () => ({
  type: AT.GET_GOOGLE_AUTHENTICATOR_SECRET_URL
})

export const verifyGoogleAuthenticator = (code) => ({
  payload: { code },
  type: AT.VERIFY_GOOGLE_AUTHENTICATOR
})

export const setYubikey = (code) => ({ payload: { code }, type: AT.SET_YUBIKEY })

export const sendMobileVerificationCode = (mobile) => ({
  payload: { mobile },
  type: AT.SEND_MOBILE_VERIFICATION_CODE
})

export const verifyMobile = (code) => ({
  payload: { code },
  type: AT.VERIFY_MOBILE_SECURITY_CENTER
})

export const disableTwoStep = () => ({
  payload: { authType: '0' },
  type: AT.DISABLE_TWO_STEP
})

export const setVerifiedMobileAsTwoFactor = () => ({
  type: AT.SET_VERIFIED_MOBILE_AS_TWO_FACTOR
})

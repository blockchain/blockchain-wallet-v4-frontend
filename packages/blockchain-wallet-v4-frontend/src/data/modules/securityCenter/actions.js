import * as AT from './actionTypes'

export const updateEmail = (email) => ({ type: AT.UPDATE_EMAIL, payload: { email } })

export const verifyEmail = (code) => ({ type: AT.VERIFY_EMAIL, payload: { code } })

export const verifyEmailCode = (code) => ({ type: AT.VERIFY_EMAIL_CODE, payload: { code } })

export const sendConfirmationCodeEmail = (email) => ({ type: AT.SEND_CONFIRMATION_CODE_EMAIL, payload: { email } })

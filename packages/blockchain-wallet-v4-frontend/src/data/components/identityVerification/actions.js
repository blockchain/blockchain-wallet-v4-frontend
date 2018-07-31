import * as AT from './actionTypes'

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

export const setSupportedCountries = countries => ({
  type: AT.SET_SUPPORTED_COUNTRIES,
  payload: { countries }
})
export const setPossibleAddresses = addresses => ({
  type: AT.SET_POSSIBLE_ADDRESSES,
  payload: { addresses }
})

export const savePersonalData = () => ({ type: AT.SAVE_PERSONAL_DATA })
export const saveAddress = () => ({ type: AT.SAVE_ADDRESS })
export const fetchSupportedCountries = () => ({
  type: AT.FETCH_SUPPORTED_COUNTRIES
})
export const fetchPossibleAddresses = (postCode, countryCode) => ({
  type: AT.FETCH_POSSIBLE_ADDRESSES,
  payload: { postCode, countryCode }
})
export const selectAddress = address => ({
  type: AT.SELECT_ADDRESS,
  payload: { address }
})

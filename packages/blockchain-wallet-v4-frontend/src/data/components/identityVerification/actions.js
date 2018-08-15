import * as AT from './actionTypes'

export const setVerificationStep = step => ({
  type: AT.SET_VERIFICATION_STEP,
  payload: { step }
})
export const setSmsStep = step => ({ type: AT.SET_SMS_STEP, payload: { step } })

export const updateSmsStep = () => ({ type: AT.UPDATE_SMS_STEP })
export const updateSmsNumber = () => ({ type: AT.UPDATE_SMS_NUMBER })
export const verifySmsNumber = () => ({ type: AT.VERIFY_SMS_NUMBER })
export const resendSmsCode = () => ({ type: AT.RESEND_SMS_CODE })

export const setSupportedCountries = countries => ({
  type: AT.SET_SUPPORTED_COUNTRIES,
  payload: { countries }
})
export const setPossibleAddresses = addresses => ({
  type: AT.SET_POSSIBLE_ADDRESSES,
  payload: { addresses }
})

export const savePersonalData = () => ({ type: AT.SAVE_PERSONAL_DATA })
export const fetchSupportedCountries = () => ({
  type: AT.FETCH_SUPPORTED_COUNTRIES
})
export const fetchPossibleAddresses = (postCode, countryCode) => ({
  type: AT.FETCH_POSSIBLE_ADDRESSES,
  payload: { postCode, countryCode }
})
export const setAddressRefetchVisible = isVisible => ({
  type: AT.SET_ADDRESS_REFETCH_VISIBLE,
  payload: { isVisible }
})
export const selectAddress = address => ({
  type: AT.SELECT_ADDRESS,
  payload: { address }
})

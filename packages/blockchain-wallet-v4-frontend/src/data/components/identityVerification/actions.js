import * as AT from './actionTypes'

export const verifyIdentity = () => ({
  type: AT.VERIFY_IDENTITY
})

export const initializeStep = () => ({
  type: AT.INITIALIZE_STEP
})

export const setVerificationStep = step => ({
  type: AT.SET_VERIFICATION_STEP,
  payload: { step }
})

export const fetchSupportedCountries = () => ({
  type: AT.FETCH_SUPPORTED_COUNTRIES
})
export const setSupportedCountries = countries => ({
  type: AT.SET_SUPPORTED_COUNTRIES,
  payload: { countries }
})

export const fetchSupportedDocuments = countryCode => ({
  type: AT.FETCH_SUPPORTED_DOCUMENTS,
  payload: { countryCode }
})
export const setSupportedDocuments = documentTypes => ({
  type: AT.SET_SUPPORTED_DOCUMENTS,
  payload: { documentTypes }
})

export const fetchStates = () => ({
  type: AT.FETCH_STATES
})
export const setStates = states => ({
  type: AT.SET_STATES,
  payload: { states }
})

export const fetchPossibleAddresses = (postCode, countryCode) => ({
  type: AT.FETCH_POSSIBLE_ADDRESSES,
  payload: { postCode, countryCode }
})
export const setPossibleAddresses = addresses => ({
  type: AT.SET_POSSIBLE_ADDRESSES,
  payload: { addresses }
})
export const selectAddress = address => ({
  type: AT.SELECT_ADDRESS,
  payload: { address }
})
export const setAddressRefetchVisible = isVisible => ({
  type: AT.SET_ADDRESS_REFETCH_VISIBLE,
  payload: { isVisible }
})

export const savePersonalData = () => ({ type: AT.SAVE_PERSONAL_DATA })

export const setSmsStep = step => ({ type: AT.SET_SMS_STEP, payload: { step } })

export const updateSmsStep = () => ({ type: AT.UPDATE_SMS_STEP })
export const updateSmsNumber = () => ({ type: AT.UPDATE_SMS_NUMBER })
export const verifySmsNumber = () => ({ type: AT.VERIFY_SMS_NUMBER })
export const resendSmsCode = () => ({ type: AT.RESEND_SMS_CODE })

export const createRegisterUserCampaign = (
  campaignName,
  needsIdVerification
) => ({
  type: AT.CREATE_REGISTER_USER_CAMPAIGN,
  payload: { campaignName, needsIdVerification }
})

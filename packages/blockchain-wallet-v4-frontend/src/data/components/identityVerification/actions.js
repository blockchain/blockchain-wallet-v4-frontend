import { TIERS } from '../../modules/profile/model'
import * as AT from './actionTypes'

export const verifyIdentity = (
  tier = TIERS[2],
  isCoinify = false,
  needMoreInfo = false
) => ({
  type: AT.VERIFY_IDENTITY,
  payload: { tier, isCoinify, needMoreInfo }
})

export const initializeVerification = (tier, isCoinify, needMoreInfo) => ({
  type: AT.INITIALIZE_VERIFICATION,
  payload: { tier, isCoinify, needMoreInfo }
})
export const goToPrevStep = () => ({
  type: AT.GO_TO_PREV_STEP
})
export const goToNextStep = () => ({
  type: AT.GO_TO_NEXT_STEP
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

export const savePersonalData = () => ({ type: AT.SAVE_PERSONAL_DATA })

export const setSmsStep = step => ({ type: AT.SET_SMS_STEP, payload: { step } })

export const updateSmsStep = () => ({ type: AT.UPDATE_SMS_STEP })
export const updateSmsNumber = () => ({ type: AT.UPDATE_SMS_NUMBER })
export const verifySmsNumber = () => ({ type: AT.VERIFY_SMS_NUMBER })
export const resendSmsCode = () => ({ type: AT.RESEND_SMS_CODE })

export const registerUserCampaign = newUser => ({
  type: AT.REGISTER_USER_CAMPAIGN,
  newUser
})
export const createRegisterUserCampaign = () => ({
  type: AT.CREATE_REGISTER_USER_CAMPAIGN
})

export const checkKycFlow = () => ({
  type: AT.CHECK_KYC_FLOW
})
export const setKycFlow = flowConfig => ({
  type: AT.SET_KYC_FLOW_CONFIG,
  payload: { flowConfig }
})
export const sendDeeplink = () => ({
  type: AT.SEND_DEEP_LINK
})

export const setStepsLoading = () => ({
  type: AT.SET_STEPS_LOADING
})
export const setStepsFailure = error => ({
  type: AT.SET_STEPS_FAILURE,
  payload: { error }
})
export const setStepsSuccess = steps => ({
  type: AT.SET_STEPS_SUCCESS,
  payload: { steps }
})

export const updateEmail = email => ({
  type: AT.UPDATE_EMAIL,
  payload: { email }
})
export const sendEmailVerification = email => ({
  type: AT.SEND_EMAIL_VERIFICATION,
  payload: { email }
})
export const setEmailStep = step => ({
  type: AT.SET_EMAIL_STEP,
  payload: { step }
})

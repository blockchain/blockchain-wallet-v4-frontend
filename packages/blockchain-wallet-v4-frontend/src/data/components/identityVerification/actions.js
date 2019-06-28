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
export const setSupportedCountriesLoading = () => ({
  type: AT.SET_SUPPORTED_COUNTRIES_LOADING
})
export const setSupportedCountriesSuccess = countries => ({
  type: AT.SET_SUPPORTED_COUNTRIES_SUCCESS,
  payload: { countries }
})
export const setSupportedCountriesFailure = e => ({
  type: AT.SET_SUPPORTED_COUNTRIES_FAILURE,
  payload: { e }
})

export const fetchSupportedDocuments = countryCode => ({
  type: AT.FETCH_SUPPORTED_DOCUMENTS,
  payload: { countryCode }
})
export const setSupportedDocumentsLoading = () => ({
  type: AT.SET_SUPPORTED_DOCUMENTS_LOADING
})
export const setSupportedDocumentsSuccess = documentTypes => ({
  type: AT.SET_SUPPORTED_DOCUMENTS_SUCCESS,
  payload: { documentTypes }
})
export const setSupportedDocumentsFailure = e => ({
  type: AT.SET_SUPPORTED_DOCUMENTS_FAILURE,
  payload: { e }
})

export const fetchStates = isCoinify => ({
  type: AT.FETCH_STATES,
  payload: {
    isCoinify
  }
})
export const setStatesLoading = () => ({ type: AT.SET_STATES_LOADING })
export const setStatesSuccess = states => ({
  type: AT.SET_STATES_SUCCESS,
  payload: { states }
})
export const setStatesFailure = e => ({
  type: AT.SET_STATES_FAILURE,
  payload: { e }
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
export const claimCampaignClicked = campaign => ({
  type: AT.CLAIM_CAMPAIGN_CLICKED,
  payload: { campaign }
})

export const checkKycFlow = () => ({
  type: AT.CHECK_KYC_FLOW
})
export const setKycFlowLoading = () => ({
  type: AT.SET_KYC_FLOW_LOADING
})
export const setKycFlowSuccess = flowType => ({
  type: AT.SET_KYC_FLOW_SUCCESS,
  payload: { flowType }
})
export const setKycFlowFailure = e => ({
  type: AT.SET_KYC_FLOW_FAILURE,
  payload: { e }
})
export const sendDeeplink = () => ({
  type: AT.SEND_DEEP_LINK
})

export const getPreIdvData = () => ({
  type: AT.GET_PRE_IDV_DATA
})
export const setPreIdvDataLoading = () => ({
  type: AT.SET_PRE_IDV_DATA_LOADING
})
export const setPreIdvDataSuccess = preIdvData => ({
  type: AT.SET_PRE_IDV_DATA_SUCCESS,
  payload: { preIdvData }
})
export const setPreIdvDataFailure = e => ({
  type: AT.SET_PRE_IDV_DATA_FAILURE,
  payload: { e }
})
export const preIdvCheckFinished = () => ({
  type: AT.PRE_IDV_CHECK_FINISHED
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

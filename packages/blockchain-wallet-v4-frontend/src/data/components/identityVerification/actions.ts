import * as AT from './actionTypes'
import {
  CampaignsType,
  DocumentType,
  IdentityVerificationActionTypes,
  StepsType
} from './types'

export const verifyIdentity = (
  tier: number,
  needMoreInfo?: boolean,
  checkSddEligibility?: boolean,
  onCompletionCallback?: () => void
): IdentityVerificationActionTypes => ({
  type: AT.VERIFY_IDENTITY,
  payload: {
    checkSddEligibility,
    needMoreInfo,
    onCompletionCallback,
    tier
  }
})

export const initializeVerification = (tier, needMoreInfo) => ({
  type: AT.INITIALIZE_VERIFICATION,
  payload: { tier, needMoreInfo }
})
export const goToPrevStep = () => ({
  type: AT.GO_TO_PREV_STEP
})
export const goToNextStep = () => ({
  type: AT.GO_TO_NEXT_STEP
})
export const setVerificationStep = (
  step: StepsType
): IdentityVerificationActionTypes => ({
  type: AT.SET_VERIFICATION_STEP,
  payload: { step }
})
export const resetVerificationStep = () => ({
  type: AT.RESET_VERIFICATION_STEP
})

export const fetchSupportedCountries = () => ({
  type: AT.FETCH_SUPPORTED_COUNTRIES
})
export const setSupportedCountriesLoading = (): IdentityVerificationActionTypes => ({
  type: AT.SET_SUPPORTED_COUNTRIES_LOADING
})
export const setSupportedCountriesSuccess = (
  countries
): IdentityVerificationActionTypes => ({
  type: AT.SET_SUPPORTED_COUNTRIES_SUCCESS,
  payload: { countries }
})
export const setSupportedCountriesFailure = (
  e
): IdentityVerificationActionTypes => ({
  type: AT.SET_SUPPORTED_COUNTRIES_FAILURE,
  payload: { e }
})

export const fetchSupportedDocuments = (countryCode?: string) => ({
  type: AT.FETCH_SUPPORTED_DOCUMENTS,
  payload: { countryCode }
})
export const setSupportedDocumentsLoading = (): IdentityVerificationActionTypes => ({
  type: AT.SET_SUPPORTED_DOCUMENTS_LOADING
})
export const setSupportedDocumentsSuccess = (
  documentTypes: Array<DocumentType>
): IdentityVerificationActionTypes => ({
  type: AT.SET_SUPPORTED_DOCUMENTS_SUCCESS,
  payload: { documentTypes }
})
export const setSupportedDocumentsFailure = (
  e
): IdentityVerificationActionTypes => ({
  type: AT.SET_SUPPORTED_DOCUMENTS_FAILURE,
  payload: { e }
})

export const fetchStates = () => ({
  type: AT.FETCH_STATES
})
export const setStatesLoading = (): IdentityVerificationActionTypes => ({
  type: AT.SET_STATES_LOADING
})
export const setStatesSuccess = (states): IdentityVerificationActionTypes => ({
  type: AT.SET_STATES_SUCCESS,
  payload: { states }
})
export const setStatesFailure = (e): IdentityVerificationActionTypes => ({
  type: AT.SET_STATES_FAILURE,
  payload: { e }
})

export const setSmsStep = (step): IdentityVerificationActionTypes => ({
  type: AT.SET_SMS_STEP,
  payload: { step }
})

export const updateSmsStep = () => ({ type: AT.UPDATE_SMS_STEP })
export const updateSmsNumber = () => ({ type: AT.UPDATE_SMS_NUMBER })
export const verifySmsNumber = () => ({ type: AT.VERIFY_SMS_NUMBER })
export const resendSmsCode = () => ({ type: AT.RESEND_SMS_CODE })

export const registerUserCampaign = (newUser: boolean) => ({
  type: AT.REGISTER_USER_CAMPAIGN,
  newUser
})
export const createRegisterUserCampaign = () => ({
  type: AT.CREATE_REGISTER_USER_CAMPAIGN
})
export const claimCampaignClicked = (campaign: CampaignsType) => ({
  type: AT.CLAIM_CAMPAIGN_CLICKED,
  payload: { campaign }
})

export const checkKycFlow = () => ({
  type: AT.CHECK_KYC_FLOW
})
export const setKycFlowLoading = (): IdentityVerificationActionTypes => ({
  type: AT.SET_KYC_FLOW_LOADING
})
export const setKycFlowSuccess = (
  flowConfig
): IdentityVerificationActionTypes => ({
  type: AT.SET_KYC_FLOW_SUCCESS,
  payload: { flowConfig }
})
export const setKycFlowFailure = (e): IdentityVerificationActionTypes => ({
  type: AT.SET_KYC_FLOW_FAILURE,
  payload: { e }
})
export const sendDeeplink = () => ({
  type: AT.SEND_DEEP_LINK
})

export const getPreIdvData = () => ({
  type: AT.GET_PRE_IDV_DATA
})
export const setPreIdvDataLoading = (): IdentityVerificationActionTypes => ({
  type: AT.SET_PRE_IDV_DATA_LOADING
})
export const setPreIdvDataSuccess = (
  preIdvData
): IdentityVerificationActionTypes => ({
  type: AT.SET_PRE_IDV_DATA_SUCCESS,
  payload: { preIdvData }
})
export const setPreIdvDataFailure = (e): IdentityVerificationActionTypes => ({
  type: AT.SET_PRE_IDV_DATA_FAILURE,
  payload: { e }
})
export const preIdvCheckFinished = () => ({
  type: AT.PRE_IDV_CHECK_FINISHED
})

export const setStepsLoading = (): IdentityVerificationActionTypes => ({
  type: AT.SET_STEPS_LOADING
})
export const setStepsFailure = (e): IdentityVerificationActionTypes => ({
  type: AT.SET_STEPS_FAILURE,
  payload: { e }
})
export const setStepsSuccess = (steps): IdentityVerificationActionTypes => ({
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
export const setEmailStep = (step): IdentityVerificationActionTypes => ({
  type: AT.SET_EMAIL_STEP,
  payload: { step }
})

export const saveInfoAndResidentialData = (
  checkSddEligibility,
  onCompletionCallback
) => ({
  type: AT.SAVE_INFO_AND_RESIDENTIAL_DATA,
  payload: { checkSddEligibility, onCompletionCallback }
})

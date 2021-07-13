import * as AT from './actionTypes'
import {
  CampaignsType,
  DocumentType,
  IdentityVerificationActionTypes,
  StepsType,
  VerifyIdentityOriginType
} from './types'

export const verifyIdentity = (payload: {
  checkSddEligibility?: boolean
  needMoreInfo?: boolean
  onCompletionCallback?: () => void
  origin: VerifyIdentityOriginType
  tier: number
}): IdentityVerificationActionTypes => ({
  payload,
  type: AT.VERIFY_IDENTITY
})

export const initializeVerification = (tier, needMoreInfo) => ({
  payload: { needMoreInfo, tier },
  type: AT.INITIALIZE_VERIFICATION
})
export const goToPrevStep = () => ({
  type: AT.GO_TO_PREV_STEP
})
export const goToNextStep = () => ({
  type: AT.GO_TO_NEXT_STEP
})
export const setVerificationStep = (step: StepsType): IdentityVerificationActionTypes => ({
  payload: { step },
  type: AT.SET_VERIFICATION_STEP
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
export const setSupportedCountriesSuccess = (countries): IdentityVerificationActionTypes => ({
  payload: { countries },
  type: AT.SET_SUPPORTED_COUNTRIES_SUCCESS
})
export const setSupportedCountriesFailure = (e): IdentityVerificationActionTypes => ({
  payload: { e },
  type: AT.SET_SUPPORTED_COUNTRIES_FAILURE
})

export const fetchSupportedDocuments = (countryCode?: string) => ({
  payload: { countryCode },
  type: AT.FETCH_SUPPORTED_DOCUMENTS
})
export const setSupportedDocumentsLoading = (): IdentityVerificationActionTypes => ({
  type: AT.SET_SUPPORTED_DOCUMENTS_LOADING
})
export const setSupportedDocumentsSuccess = (
  documentTypes: Array<DocumentType>
): IdentityVerificationActionTypes => ({
  payload: { documentTypes },
  type: AT.SET_SUPPORTED_DOCUMENTS_SUCCESS
})
export const setSupportedDocumentsFailure = (e): IdentityVerificationActionTypes => ({
  payload: { e },
  type: AT.SET_SUPPORTED_DOCUMENTS_FAILURE
})

export const fetchStates = () => ({
  type: AT.FETCH_STATES
})
export const setStatesLoading = (): IdentityVerificationActionTypes => ({
  type: AT.SET_STATES_LOADING
})
export const setStatesSuccess = (states): IdentityVerificationActionTypes => ({
  payload: { states },
  type: AT.SET_STATES_SUCCESS
})
export const setStatesFailure = (e): IdentityVerificationActionTypes => ({
  payload: { e },
  type: AT.SET_STATES_FAILURE
})

export const setSmsStep = (step): IdentityVerificationActionTypes => ({
  payload: { step },
  type: AT.SET_SMS_STEP
})

export const updateSmsStep = () => ({ type: AT.UPDATE_SMS_STEP })
export const updateSmsNumber = () => ({ type: AT.UPDATE_SMS_NUMBER })
export const verifySmsNumber = () => ({ type: AT.VERIFY_SMS_NUMBER })
export const resendSmsCode = () => ({ type: AT.RESEND_SMS_CODE })

export const registerUserCampaign = (newUser: boolean) => ({
  newUser,
  type: AT.REGISTER_USER_CAMPAIGN
})
export const createRegisterUserCampaign = () => ({
  type: AT.CREATE_REGISTER_USER_CAMPAIGN
})
export const claimCampaignClicked = (campaign: CampaignsType) => ({
  payload: { campaign },
  type: AT.CLAIM_CAMPAIGN_CLICKED
})

export const checkKycFlow = () => ({
  type: AT.CHECK_KYC_FLOW
})
export const setKycFlowLoading = (): IdentityVerificationActionTypes => ({
  type: AT.SET_KYC_FLOW_LOADING
})
export const setKycFlowSuccess = (flowConfig): IdentityVerificationActionTypes => ({
  payload: { flowConfig },
  type: AT.SET_KYC_FLOW_SUCCESS
})
export const setKycFlowFailure = (e): IdentityVerificationActionTypes => ({
  payload: { e },
  type: AT.SET_KYC_FLOW_FAILURE
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
export const setPreIdvDataSuccess = (preIdvData): IdentityVerificationActionTypes => ({
  payload: { preIdvData },
  type: AT.SET_PRE_IDV_DATA_SUCCESS
})
export const setPreIdvDataFailure = (e): IdentityVerificationActionTypes => ({
  payload: { e },
  type: AT.SET_PRE_IDV_DATA_FAILURE
})
export const preIdvCheckFinished = () => ({
  type: AT.PRE_IDV_CHECK_FINISHED
})

export const setStepsLoading = (): IdentityVerificationActionTypes => ({
  type: AT.SET_STEPS_LOADING
})
export const setStepsFailure = (e): IdentityVerificationActionTypes => ({
  payload: { e },
  type: AT.SET_STEPS_FAILURE
})
export const setStepsSuccess = (steps): IdentityVerificationActionTypes => ({
  payload: { steps },
  type: AT.SET_STEPS_SUCCESS
})

export const updateEmail = (email) => ({
  payload: { email },
  type: AT.UPDATE_EMAIL
})
export const sendEmailVerification = (email) => ({
  payload: { email },
  type: AT.SEND_EMAIL_VERIFICATION
})
export const setEmailStep = (step): IdentityVerificationActionTypes => ({
  payload: { step },
  type: AT.SET_EMAIL_STEP
})

export const saveInfoAndResidentialData = (checkSddEligibility, onCompletionCallback) => ({
  payload: { checkSddEligibility, onCompletionCallback },
  type: AT.SAVE_INFO_AND_RESIDENTIAL_DATA
})

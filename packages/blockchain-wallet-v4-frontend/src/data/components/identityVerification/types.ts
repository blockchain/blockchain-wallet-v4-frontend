import { ExtraQuestionsType, NabuAddressType, RemoteDataType } from '@core/types'

import * as AT from './actionTypes'

export type EmailSmsStepType = 'edit' | 'verify'

export type VerifyIdentityOriginType =
  | 'DashboardPromo'
  | 'CompleteProfile'
  | 'Unknown'
  | 'Swap'
  | 'Send'
  | 'Goals'
  | 'AccountReset'
  | 'Resubmission'
  | 'Onboarding'
  | 'Settings'
  | 'BuySell'
  | 'Interest'

export type StepsType = 'personal' | 'moreInfo' | 'mobile' | 'verify' | 'submitted'

export type KycStatesType =
  | 'NONE'
  | 'PENDING'
  | 'UNDER_REVIEW'
  | 'REJECTED'
  | 'VERIFIED'
  | 'EXPIRED'

export type DocumentType =
  | 'PASSPORT'
  | 'DRIVING_LICENCE'
  | 'NATIONAL_IDENTITY_CARD'
  | 'RESIDENCE_PERMIT'

export type PreIdvDataType = {
  sessionId: string
  userId: string
}

export type ScopesType = Array<'KYC' | 'Mercury'>

export type CampaignsType = 'BLOCKSTACK' | 'POWER_PAX' | 'SUNRIVER'

export type StateType = {
  name: string
  scopes: ScopesType
}

export type CountryType = {
  code: string
  name: string
  regions: Array<string>
  scopes: ScopesType
  states: Array<string>
}

// State
export interface IdentityVerificationState {
  addressRefetchVisible: boolean
  emailStep: EmailSmsStepType
  flowConfig: RemoteDataType<string, any>
  kycExtraQuestions: RemoteDataType<string, ExtraQuestionsType>
  preIdvData: RemoteDataType<string, PreIdvDataType>
  smsStep: RemoteDataType<string, EmailSmsStepType>
  states: RemoteDataType<string, StateType>
  steps: RemoteDataType<string, Array<StepsType>>
  supportedCountries: RemoteDataType<string, Array<CountryType>>
  supportedDocuments: RemoteDataType<string, Array<DocumentType>>
  verificationStep: StepsType | null
}

// Actions
// Keep these sorted alphabetically
interface FetchSupportedDocumentAction {
  payload: {
    countryCode: string
  }
  type: typeof AT.FETCH_SUPPORTED_DOCUMENTS
}

interface SetEmailStepAction {
  payload: {
    step: EmailSmsStepType
  }
  type: typeof AT.SET_EMAIL_STEP
}

interface SetKycFlowFailureAction {
  // FIXME: TypeScript e: Error?
  payload: {
    e: string
  }
  type: typeof AT.SET_KYC_FLOW_FAILURE
}

interface SetKycFlowLoadingAction {
  type: typeof AT.SET_KYC_FLOW_LOADING
}

interface SetKycFlowSuccessAction {
  // FIXME: TypeScript flowConfig: ?
  payload: {
    flowConfig: any
  }
  type: typeof AT.SET_KYC_FLOW_SUCCESS
}

interface SetPreIdvFailureAction {
  // FIXME: TypeScript e: Error?
  payload: {
    e: string
  }
  type: typeof AT.SET_PRE_IDV_DATA_FAILURE
}

interface SetPreIdvLoadingAction {
  type: typeof AT.SET_PRE_IDV_DATA_LOADING
}

interface SetPreIdvSuccessAction {
  payload: {
    preIdvData: PreIdvDataType
  }
  type: typeof AT.SET_PRE_IDV_DATA_SUCCESS
}

interface SetSmsStepAction {
  payload: {
    step: EmailSmsStepType
  }
  type: typeof AT.SET_SMS_STEP
}

interface SetStepsFailureAction {
  // FIXME: TypeScript e: Error?
  payload: {
    e: string
  }
  type: typeof AT.SET_STEPS_FAILURE
}

interface SetStepsLoadingAction {
  type: typeof AT.SET_STEPS_LOADING
}

interface SetStepsSuccessAction {
  payload: {
    steps: Array<StepsType>
  }
  type: typeof AT.SET_STEPS_SUCCESS
}

interface SetSupportedCountriesFailureAction {
  // FIXME: TypeScript e: Error?
  payload: {
    e: string
  }
  type: typeof AT.SET_SUPPORTED_COUNTRIES_FAILURE
}

interface SetSupportedCountriesLoadingAction {
  type: typeof AT.SET_SUPPORTED_COUNTRIES_LOADING
}

interface SetStatesFailureAction {
  // FIXME: TypeScript e: Error?
  payload: {
    e: string
  }
  type: typeof AT.SET_STATES_FAILURE
}

interface SetStatesLoadingAction {
  type: typeof AT.SET_STATES_LOADING
}

interface SetStatesSuccessAction {
  payload: {
    states: StateType
  }
  type: typeof AT.SET_STATES_SUCCESS
}

interface SetSupportedCountriesSuccessAction {
  payload: {
    countries: Array<CountryType>
  }
  type: typeof AT.SET_SUPPORTED_COUNTRIES_SUCCESS
}

interface SetSupportedDocumentFailureAction {
  // FIXME: TypeScript e: Error?
  payload: {
    e: string
  }
  type: typeof AT.SET_SUPPORTED_DOCUMENTS_FAILURE
}
interface SetSupportedDocumentLoadingAction {
  type: typeof AT.SET_SUPPORTED_DOCUMENTS_LOADING
}

interface SetSupportedDocumentSuccessAction {
  payload: {
    documentTypes: Array<DocumentType>
  }
  type: typeof AT.SET_SUPPORTED_DOCUMENTS_SUCCESS
}

interface SetVerificationStepAction {
  payload: {
    step: StepsType
  }
  type: typeof AT.SET_VERIFICATION_STEP
}

interface ResetVerificationStepAction {
  type: typeof AT.RESET_VERIFICATION_STEP
}

interface VerifyIdentityAction {
  payload: {
    checkSddEligibility?: boolean
    needMoreInfo?: boolean
    onCompletionCallback?: () => void
    origin: VerifyIdentityOriginType
    tier: number
  }
  type: typeof AT.VERIFY_IDENTITY
}

// extra KYC
interface FetchExtraKYCFailure {
  // FIXME: TypeScript e: Error?
  payload: {
    e: string
  }
  type: typeof AT.FETCH_KYC_EXTRA_QUESTIONS_FAILURE
}

interface FetchExtraKYCLoading {
  type: typeof AT.FETCH_KYC_EXTRA_QUESTIONS_LOADING
}

interface FetchExtraKYCSuccess {
  payload: {
    questions: any
  }
  type: typeof AT.FETCH_KYC_EXTRA_QUESTIONS_SUCCESS
}
interface UpdateKYCQuestions {
  payload: {
    questions: any
  }
  type: typeof AT.UPDATE_KYC_EXTRA_QUESTIONS
}

export type IdentityVerificationActionTypes =
  | FetchSupportedDocumentAction
  | SetEmailStepAction
  | SetKycFlowFailureAction
  | SetKycFlowLoadingAction
  | SetKycFlowSuccessAction
  | SetPreIdvFailureAction
  | SetPreIdvLoadingAction
  | SetPreIdvSuccessAction
  | SetStepsFailureAction
  | SetStepsLoadingAction
  | SetStepsSuccessAction
  | SetSmsStepAction
  | SetStatesFailureAction
  | SetStatesLoadingAction
  | SetStatesSuccessAction
  | SetSupportedCountriesFailureAction
  | SetSupportedCountriesLoadingAction
  | SetSupportedCountriesSuccessAction
  | SetSupportedDocumentFailureAction
  | SetSupportedDocumentLoadingAction
  | SetSupportedDocumentSuccessAction
  | SetVerificationStepAction
  | ResetVerificationStepAction
  | VerifyIdentityAction
  | FetchExtraKYCFailure
  | FetchExtraKYCLoading
  | FetchExtraKYCSuccess
  | UpdateKYCQuestions

export type InfoAndResidentialFormValuesType = {
  country: CountryType
  dob: string
  firstName: string
  lastName: string
} & NabuAddressType['country']

export type VerifyEmailFormValuesType = {
  email: string
}

export type ExtraKeyFieldsFormValuesType = {
  fullName?: string
  q1: Array<string>
  q2: string
  q3: string
  q4: string
  relationship?: string
}

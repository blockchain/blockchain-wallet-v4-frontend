import {
  FETCH_SUPPORTED_DOCUMENTS,
  SET_SUPPORTED_DOCUMENTS_SUCCESS,
  SET_VERIFICATION_STEP,
  VERIFY_IDENTITY
} from './actionTypes'
import { RemoteData } from 'blockchain-wallet-v4/src/remote/types'

export const STEPS = {
  coinify: 'coinify',
  personal: 'personal',
  moreInfo: 'moreInfo',
  mobile: 'mobile',
  verify: 'verify',
  submitted: 'submitted'
}

export type EmailSmsTypes = { edit: 'edit'; verify: 'verify' }

export type StepsType = typeof STEPS

export const EMAIL_STEPS: EmailSmsTypes = {
  edit: 'edit',
  verify: 'verify'
}

export const SMS_STEPS = {
  edit: 'edit',
  verify: 'verify'
}

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
  emailStep: keyof EmailSmsTypes
  flowConfig: RemoteData<string, any>
  preIdvData: RemoteData<string, PreIdvDataType>
  smsStep: RemoteData<string, keyof EmailSmsTypes>
  states: RemoteData<string, StateType>
  steps: RemoteData<string, any>
  supportedCountries: RemoteData<string, Array<CountryType>>
  supportedDocuments: RemoteData<string, Array<DocumentType>>
  verificationStep: keyof StepsType | null
}

// Actions
// Keep these sorted alphabetically
interface FetchSupportedDocumentAction {
  payload: {
    countryCode: string
  }
  type: typeof FETCH_SUPPORTED_DOCUMENTS
}

interface SetSupportedDocumentSuccessAction {
  payload: {
    documentTypes: Array<DocumentType>
  }
  type: typeof SET_SUPPORTED_DOCUMENTS_SUCCESS
}

interface SetVerificationStepAction {
  payload: {
    step: keyof StepsType
  }
  type: typeof SET_VERIFICATION_STEP
}

interface VerifyIdentityAction {
  payload: {
    isCoinify?: boolean
    needMoreInfo?: boolean
    tier: number
  }
  type: typeof VERIFY_IDENTITY
}

export type IdentityVerificationActionTypes =
  | FetchSupportedDocumentAction
  | SetSupportedDocumentSuccessAction
  | SetVerificationStepAction
  | VerifyIdentityAction

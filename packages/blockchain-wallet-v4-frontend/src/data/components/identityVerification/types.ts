import { ExtraQuestionsType, NabuAddressType, RemoteDataType } from '@core/types'

export const STEPS = {
  edit: 'edit',
  verify: 'verify'
}

export type EmailSmsStepType = keyof typeof STEPS

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
  code: string
  countryCode: string
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
  states: RemoteDataType<string, Array<StateType>>
  steps: RemoteDataType<string, Array<StepsType>>
  supportedCountries: RemoteDataType<string, Array<CountryType>>
  supportedDocuments: RemoteDataType<string, Array<DocumentType>>
  verificationStep: StepsType | null
}

export type InfoAndResidentialFormValuesType = {
  country: CountryType
  dob: string
  firstName: string
  lastName: string
  state?: string
} & NabuAddressType

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

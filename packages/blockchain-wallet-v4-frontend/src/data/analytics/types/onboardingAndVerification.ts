// Onboarding and Verification Events
export enum Events {
  ONBOARDING_ADDRESS_ENTERED = 'Address Information Entered',
  ONBOARDING_COMPLETE_PROFILE_BANNER_CLICKED = 'Peeksheet Process Clicked',
  ONBOARDING_COMPLETE_PROFILE_MODAL_BUTTON_CLICKED = 'Peeksheet Selection Clicked',
  ONBOARDING_COMPLETE_PROFILE_MODAL_CLOSED = 'Peeksheet Dismissed',
  ONBOARDING_COMPLETE_PROFILE_MODAL_VIEWED = 'Peeksheet Viewed',
  ONBOARDING_EMAIL_VERIFICATION_REQUESTED = 'Email Verification Requested',
  ONBOARDING_EMAIL_VERIFICATION_SKIPPED = 'Email Verification Skipped',
  ONBOARDING_EMAIL_VERIFIED = 'Email Verified',
  ONBOARDING_EXCHANGE_SIGNED_UP = 'Exchange Signed Up',
  ONBOARDING_MANUAL_VERIFICATION_REQUIRED = 'Manual Verification Required',
  ONBOARDING_PERSONAL_INFORMATION_CLICKED = 'Personal Information Entered',
  ONBOARDING_SIGNED_UP = 'Signed Up',
  ONBOARDING_SIGNUP_CLICKED = 'Sign Up Clicked',
  ONBOARDING_SIGNUP_COUNTRY_SELECTED = 'Sign Up Country Selected',
  ONBOARDING_SIGNUP_COUNTRY_STATE_SELECTED = 'Sign Up Country State Selected',
  ONBOARDING_UPGRADE_VERIFICATION_CLICKED = 'Upgrade Verification Clicked',
  ONBOARDING_VERIFICATION_COMPLETED = 'Verification Completed',
  ONBOARDING_VERIFICATION_REJECTED = 'Verification Rejected',
  ONBOARDING_VERIFICATION_STARTED = 'Verification Started',
  ONBOARDING_VERIFICATION_SUBMISSION_FAILED = 'Verification Submission Failed',
  ONBOARDING_WALLET_SIGNED_UP = 'Wallet Signed Up'
}

type OriginProductFlow = 'SECURITY' | 'SIGN_UP' | 'VERIFICATION'
type CompleteProfileSteps = 'BUY_CRYPTO' | 'LINK_PAYMENT' | 'VERIFY'

type OriginVerification =
  | 'AIRDROP'
  | 'DASHBOARD_PROMO'
  | 'DEPOSIT'
  | 'EDD'
  | 'FIAT_FUNDS'
  | 'INTEREST'
  | 'MARGIN'
  | 'ONBOARDING'
  | 'PEEKSHEET'
  | 'RESUBMISSION'
  | 'SAVINGS'
  | 'SETTINGS'
  | 'SIGN_UP'
  | 'SIMPLEBUY'
  | 'SIMPLETRADE'
  | 'SWAP'
  | 'UNKNOWN'
  | 'WITHDRAW'

type VerificationProvider =
  | 'BLOCKCHAIN'
  | 'MANUAL'
  | 'ONFIDO'
  | 'RDC'
  | 'RDC_MEDIA'
  | 'RDC_PEP'
  | 'VERIFF'

type FailureReason =
  | 'LOCAL_ERROR'
  | 'NETWORK_ERROR'
  | 'SERVER_ERROR'
  | 'UNKNOWN'
  | 'UPLOAD_ERROR'
  | 'VIDEO_FAILED'

type LunchByPromo = 'NUX_LAUNCH_PROMO_BUY_CRYPTO' // this is defined as single enum

type Provider = 'BLOCKCHAIN' | 'VERIFF'

type AddressEnteredAction = {
  key: Events.ONBOARDING_ADDRESS_ENTERED
  properties: {}
}

type EmailVerificationRequestAction = {
  key: Events.ONBOARDING_EMAIL_VERIFICATION_REQUESTED
  properties: {
    origin: OriginProductFlow
  }
}

type EmailVerificationSkippedAction = {
  key: Events.ONBOARDING_EMAIL_VERIFICATION_SKIPPED
  properties: {
    origin: OriginProductFlow
  }
}

type EmailVerifiedAction = {
  key: Events.ONBOARDING_EMAIL_VERIFIED
  properties: {
    email_changed: Boolean
  }
}

type ExchangeSignedUpAction = {
  key: Events.ONBOARDING_EXCHANGE_SIGNED_UP
  properties: {}
}

type ManualVerificationRequiredAction = {
  key: Events.ONBOARDING_MANUAL_VERIFICATION_REQUIRED
  properties: {
    provider: Provider
  }
}

type CompleteProfileDismissAction = {
  key: Events.ONBOARDING_COMPLETE_PROFILE_MODAL_CLOSED
  properties: {
    current_step_completed: string
  }
}

type CompleteProfileModalViewedAction = {
  key: Events.ONBOARDING_COMPLETE_PROFILE_MODAL_VIEWED
  properties: {
    current_step_completed: string
  }
}

type CompleteProfileModalButtonClickedAction = {
  key: Events.ONBOARDING_COMPLETE_PROFILE_MODAL_BUTTON_CLICKED
  properties: {
    button_clicked: boolean
    current_step_completed: string
    item: CompleteProfileSteps
  }
}

type CompleteProfileBannerClickedAction = {
  key: Events.ONBOARDING_COMPLETE_PROFILE_BANNER_CLICKED
  properties: {
    current_step_completed: string
  }
}

type PersonalInformationClickedAction = {
  key: Events.ONBOARDING_PERSONAL_INFORMATION_CLICKED
  properties: {}
}

type SignUpClickedAction = {
  key: Events.ONBOARDING_SIGNUP_CLICKED
  properties: {
    origin: LunchByPromo
  }
}

type CountrySelectedAction = {
  key: Events.ONBOARDING_SIGNUP_COUNTRY_SELECTED
  properties: {
    country: String
  }
}

type CountryStateSelectedAction = {
  key: Events.ONBOARDING_SIGNUP_COUNTRY_STATE_SELECTED
  properties: {
    country_state: String
  }
}

type SignedUpAction = {
  key: Events.ONBOARDING_SIGNED_UP
  properties: {
    is_from_linking: Boolean
  }
}

type UpgradeVerificationClickedAction = {
  key: Events.ONBOARDING_UPGRADE_VERIFICATION_CLICKED
  properties: {
    origin: OriginVerification
    tier: number
  }
}

type VerificationCompletedAction = {
  key: Events.ONBOARDING_VERIFICATION_COMPLETED
  properties: {
    provider: VerificationProvider
    tier: number
  }
}

type VerificationRejectedAction = {
  key: Events.ONBOARDING_VERIFICATION_REJECTED
  properties: {
    provider: VerificationProvider
    tier: number
  }
}

type VerificationStartedAction = {
  key: Events.ONBOARDING_VERIFICATION_STARTED
  properties: {
    provider: VerificationProvider
    tier: number
  }
}

type VerificationSubmissionFailedAction = {
  key: Events.ONBOARDING_VERIFICATION_SUBMISSION_FAILED
  properties: {
    failure_reason: FailureReason
    provider: VerificationProvider
    tier: number
  }
}

type WalletSignedUpAction = {
  key: Events.ONBOARDING_WALLET_SIGNED_UP
  properties: {
    country: String
    country_state: String
  }
}

// track event actions to be used inside codebase when we do trigger event
export type TrackEventAction =
  | AddressEnteredAction
  | EmailVerificationRequestAction
  | EmailVerificationSkippedAction
  | EmailVerifiedAction
  | ExchangeSignedUpAction
  | ManualVerificationRequiredAction
  | CompleteProfileDismissAction
  | CompleteProfileModalViewedAction
  | CompleteProfileModalButtonClickedAction
  | CompleteProfileBannerClickedAction
  | PersonalInformationClickedAction
  | SignUpClickedAction
  | CountrySelectedAction
  | CountryStateSelectedAction
  | SignedUpAction
  | UpgradeVerificationClickedAction
  | VerificationCompletedAction
  | VerificationRejectedAction
  | VerificationStartedAction
  | VerificationSubmissionFailedAction
  | WalletSignedUpAction

// shared types
type BasePayload = {
  originalTimestamp: string
}
type CurrentStepProperties = BasePayload & {
  current_step_completed: string
}
type ButtonClickProperties = BasePayload & {
  button_clicked: boolean
  item: CompleteProfileSteps
}
type ProductFlowProperties = BasePayload & {
  origin: OriginProductFlow
}

// analytics properties to be used for analytics queue typing
export type AnalyticsProperties =
  | BasePayload
  | CurrentStepProperties
  | ButtonClickProperties
  | ProductFlowProperties

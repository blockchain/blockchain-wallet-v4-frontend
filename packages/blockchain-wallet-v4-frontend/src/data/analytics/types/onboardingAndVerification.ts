// Onboarding and Verification Events
export enum OnboardingAndVerificationEvents {
  ONBOARDING_ACCOUNT_INFO_SCREEN_VIEWED = 'Account Info Screen Viewed',
  ONBOARDING_ACCOUNT_INFO_SUBMITTED = 'Account Info Submitted',
  ONBOARDING_ADDRESS_ENTERED = 'Address Information Entered',
  ONBOARDING_COMPLETE_PROFILE_BANNER_CLICKED = 'Peeksheet Process Clicked',
  ONBOARDING_COMPLETE_PROFILE_MODAL_BUTTON_CLICKED = 'Peeksheet Selection Clicked',
  ONBOARDING_COMPLETE_PROFILE_MODAL_CLOSED = 'Peeksheet Dismissed',
  ONBOARDING_COMPLETE_PROFILE_MODAL_VIEWED = 'Peeksheet Viewed',
  ONBOARDING_EMAIL_VERIFICATION_REQUESTED = 'Email Verification Requested',
  ONBOARDING_EMAIL_VERIFICATION_SKIPPED = 'Email Verification Skipped',
  ONBOARDING_EMAIL_VERIFIED = 'Email Verified',
  ONBOARDING_EXCHANGE_SIGNED_UP = 'Exchange Signed Up',
  ONBOARDING_GET_MORE_ACCESS_WHEN_YOU_VERIFY = 'Get More Access When You Verify Clicked',
  ONBOARDING_GET_MORE_ACCESS_WHEN_YOU_VERIFY_DISMISSED = 'Get More Access When You Verify Dismissed',
  ONBOARDING_MANUAL_VERIFICATION_REQUIRED = 'Manual Verification Required',
  ONBOARDING_PERSONAL_INFORMATION_ENTERED = 'Personal Information Entered',
  ONBOARDING_PRE_VERIFICATION_CTA_CLICKED = 'Pre Verification CTA Clicked',
  ONBOARDING_PRE_VERIFICATION_DISMISSED = 'Pre Verification Dismissed',
  ONBOARDING_PRE_VERIFICATION_VIEWED = 'Pre Verification Viewed',
  ONBOARDING_QUIZ_STARTED = 'Onboarding Quiz Started',
  ONBOARDING_SIGNED_UP = 'Signed Up',
  ONBOARDING_SIGNUP_CLICKED = 'Sign Up Clicked',
  ONBOARDING_SIGNUP_COUNTRY_SELECTED = 'Sign Up Country Selected',
  ONBOARDING_SIGNUP_COUNTRY_STATE_SELECTED = 'Sign Up Country State Selected',
  ONBOARDING_TRADING_LIMITS_DISMISSED = 'Trading Limits Dismissed',
  ONBOARDING_TRADING_LIMITS_GET_BASIC_CTA_CLICKED = 'Trading Limits Get Basic CTA Clicked',
  ONBOARDING_TRADING_LIMITS_GET_VERIFIED_CTA_CLICKED = 'Trading Limits Get Verified CTA Clicked',
  ONBOARDING_TRADING_LIMITS_VIEWED = 'Trading Limits Viewed',
  ONBOARDING_UPGRADE_VERIFICATION_CLICKED = 'Upgrade Verification Clicked',
  ONBOARDING_VERIFICATION_COMPLETED = 'Verification Completed',
  ONBOARDING_VERIFICATION_REJECTED = 'Verification Rejected',
  ONBOARDING_VERIFICATION_STARTED = 'Verification Started',
  ONBOARDING_VERIFICATION_SUBMISSION_FAILED = 'Verification Submission Failed',
  ONBOARDING_VERIFY_NOW_POPUP_CTA_CLICKED = 'Verify Now Pop Up CTA Clicked',
  ONBOARDING_VERIFY_NOW_POPUP_DISMISSED = 'Verify Now Pop Up Dismissed',
  ONBOARDING_VERIFY_NOW_POPUP_VIEWED = 'Verify Now Pop Up Viewed',
  ONBOARDING_WALLET_SIGNED_UP = 'Wallet Signed Up'
}

type OriginProductFlow = 'SECURITY' | 'SIGN_UP' | 'VERIFICATION' | 'BANNER'
type CompleteProfileSteps = 'BUY_CRYPTO' | 'LINK_PAYMENT' | 'VERIFY'

type FlowSteps = 'BUY' | 'SWAP'

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

type EnteredInformation = 'SETTINGS'

type Provider = 'BLOCKCHAIN' | 'VERIFF'

type EmailVerification = {
  key:
    | OnboardingAndVerificationEvents.ONBOARDING_EMAIL_VERIFICATION_REQUESTED
    | OnboardingAndVerificationEvents.ONBOARDING_EMAIL_VERIFICATION_SKIPPED
  properties: {
    origin: OriginProductFlow
  }
}

type EmailVerifiedAction = {
  key: OnboardingAndVerificationEvents.ONBOARDING_EMAIL_VERIFIED
  properties: {
    email_changed: boolean
  }
}

type ExchangeSignedUpAction = {
  key: OnboardingAndVerificationEvents.ONBOARDING_EXCHANGE_SIGNED_UP
  properties: {
    country: string
    country_state: string
    device_origin: string
    origin?: string
    unified?: boolean
  }
}

type GetMoreAccessWhenYouVerify = {
  key: OnboardingAndVerificationEvents.ONBOARDING_GET_MORE_ACCESS_WHEN_YOU_VERIFY
  properties: {
    flow_step: FlowSteps
  }
}

type ManualVerificationRequiredAction = {
  key: OnboardingAndVerificationEvents.ONBOARDING_MANUAL_VERIFICATION_REQUIRED
  properties: {
    provider: Provider
  }
}

type CompleteProfileGenericAction = {
  key:
    | OnboardingAndVerificationEvents.ONBOARDING_COMPLETE_PROFILE_MODAL_CLOSED
    | OnboardingAndVerificationEvents.ONBOARDING_COMPLETE_PROFILE_MODAL_VIEWED
    | OnboardingAndVerificationEvents.ONBOARDING_COMPLETE_PROFILE_BANNER_CLICKED
  properties: {
    current_step_completed: string
  }
}

type CompleteProfileModalButtonClickedAction = {
  key: OnboardingAndVerificationEvents.ONBOARDING_COMPLETE_PROFILE_MODAL_BUTTON_CLICKED
  properties: {
    button_clicked: boolean
    current_step_completed: string
    item: CompleteProfileSteps
  }
}

type PersonalInformationEnteredAction = {
  key: OnboardingAndVerificationEvents.ONBOARDING_PERSONAL_INFORMATION_ENTERED
  properties: {
    origin: EnteredInformation
  }
}

type SignUpClickedAction = {
  key: OnboardingAndVerificationEvents.ONBOARDING_SIGNUP_CLICKED
  properties: {
    origin: LunchByPromo
  }
}

type CountrySelectedAction = {
  key: OnboardingAndVerificationEvents.ONBOARDING_SIGNUP_COUNTRY_SELECTED
  properties: {
    country: string
  }
}

type CountryStateSelectedAction = {
  key: OnboardingAndVerificationEvents.ONBOARDING_SIGNUP_COUNTRY_STATE_SELECTED
  properties: {
    country_state: string
  }
}

type SignedUpAction = {
  key: OnboardingAndVerificationEvents.ONBOARDING_SIGNED_UP
  properties: {
    is_from_linking: boolean
  }
}

type UpgradeVerificationClickedAction = {
  key: OnboardingAndVerificationEvents.ONBOARDING_UPGRADE_VERIFICATION_CLICKED
  properties: {
    origin: OriginVerification
    tier: number
  }
}

type VerificationStateAction = {
  key:
    | OnboardingAndVerificationEvents.ONBOARDING_VERIFICATION_COMPLETED
    | OnboardingAndVerificationEvents.ONBOARDING_VERIFICATION_REJECTED
    | OnboardingAndVerificationEvents.ONBOARDING_VERIFICATION_STARTED
  properties: {
    provider: VerificationProvider
    tier: number
  }
}

type VerificationSubmissionFailedAction = {
  key: OnboardingAndVerificationEvents.ONBOARDING_VERIFICATION_SUBMISSION_FAILED
  properties: {
    failure_reason: FailureReason
    provider: VerificationProvider
    tier: number
  }
}

type WalletSignedUpAction = {
  key: OnboardingAndVerificationEvents.ONBOARDING_WALLET_SIGNED_UP
  properties: {
    country: string
    country_state: string
    device_origin: string
    unified?: boolean
  }
}

type TradingLimitsAction = {
  key:
    | OnboardingAndVerificationEvents.ONBOARDING_TRADING_LIMITS_VIEWED
    | OnboardingAndVerificationEvents.ONBOARDING_TRADING_LIMITS_GET_VERIFIED_CTA_CLICKED
    | OnboardingAndVerificationEvents.ONBOARDING_TRADING_LIMITS_GET_BASIC_CTA_CLICKED
    | OnboardingAndVerificationEvents.ONBOARDING_TRADING_LIMITS_DISMISSED
  properties: {
    tier: number
  }
}

type OnboardingGenericActions = {
  key:
    | OnboardingAndVerificationEvents.ONBOARDING_ADDRESS_ENTERED
    | OnboardingAndVerificationEvents.ONBOARDING_VERIFY_NOW_POPUP_CTA_CLICKED
    | OnboardingAndVerificationEvents.ONBOARDING_VERIFY_NOW_POPUP_DISMISSED
    | OnboardingAndVerificationEvents.ONBOARDING_VERIFY_NOW_POPUP_VIEWED
    | OnboardingAndVerificationEvents.ONBOARDING_PRE_VERIFICATION_CTA_CLICKED
    | OnboardingAndVerificationEvents.ONBOARDING_PRE_VERIFICATION_DISMISSED
    | OnboardingAndVerificationEvents.ONBOARDING_PRE_VERIFICATION_VIEWED
    | OnboardingAndVerificationEvents.ONBOARDING_ACCOUNT_INFO_SCREEN_VIEWED
    | OnboardingAndVerificationEvents.ONBOARDING_ACCOUNT_INFO_SUBMITTED
    | OnboardingAndVerificationEvents.ONBOARDING_QUIZ_STARTED
  properties: {}
}

type OnboardingQuizStarted = {
  key: OnboardingAndVerificationEvents.ONBOARDING_QUIZ_STARTED
  properties: {}
}

// track event actions to be used inside codebase when we do trigger event
export type OnboardingAndVerificationActions =
  | CompleteProfileGenericAction
  | CompleteProfileModalButtonClickedAction
  | CountrySelectedAction
  | CountryStateSelectedAction
  | EmailVerification
  | EmailVerifiedAction
  | ExchangeSignedUpAction
  | GetMoreAccessWhenYouVerify
  | ManualVerificationRequiredAction
  | OnboardingGenericActions
  | PersonalInformationEnteredAction
  | SignedUpAction
  | SignUpClickedAction
  | TradingLimitsAction
  | UpgradeVerificationClickedAction
  | VerificationStateAction
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
export type OnboardingAndVerificationAnalyticsProperties =
  | BasePayload
  | ButtonClickProperties
  | CurrentStepProperties
  | ProductFlowProperties

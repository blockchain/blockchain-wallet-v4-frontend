import { RemoteDataType } from '@core/types'

import { PlatformTypes, ProductAuthOptions } from '../auth/types'

export enum SignupRedirectTypes {
  EXCHANGE_HOME = 'EXCHANGE_HOME',
  WALLET_HOME = 'WALLET_HOME'
}

export type ProductSignupMetadata = {
  platform?: PlatformTypes
  product?: ProductAuthOptions
  referrerUsername?: string
  signupRedirect?: SignupRedirectTypes
  tuneTid?: string
}

export enum RecoverSteps {
  AUTHENTICATOR_SETUP = 'AUTHENTICATOR_SETUP',
  CHECK_INBOX = 'CHECK_INBOX',
  CHOOSE_TWOFA = 'CHOOSE_TWOFA',
  CLOUD_RECOVERY = 'CLOUD_RECOVERY',
  FORGOT_PASSWORD_EMAIL = 'FORGOT_PASSWORD_EMAIL',
  NEW_PASSWORD = 'NEW_PASSWORD',
  RECOVERY_OPTIONS = 'RECOVERY_OPTIONS',
  RECOVERY_PHRASE = 'RECOVERY_PHRASE',
  RESET_ACCOUNT = 'RESET_ACCOUNT',
  RESET_PASSWORD = 'RESET_PASSWORD',
  RESET_WARNING = 'RESET_WARNING',
  SMS_SETUP = 'SMS_SETUP',
  TWO_FA_CONFIRMATION = 'TWO_FA_CONFIRMATION',
  YUBIKEY_SETUP = 'YUBIKEY_SETUP'
}

export enum ResetFormSteps {
  AUTHENTICATOR_SETUP = 'AUTHENTICATOR_SETUP',
  CHOOSE_TWOFA = 'CHOOSE_TWOFA',
  NEW_PASSWORD = 'NEW_PASSWORD',
  RESET_WARNING = 'RESET_WARNING',
  SMS_SETUP = 'SMS_SETUP',
  TWO_FA_CONFIRMATION = 'TWO_FA_CONFIRMATION',
  YUBIKEY_SETUP = 'YUBIKEY_SETUP'
}

export type RecoverFormType = {
  email?: string
  mnemonic?: string
  newTwoFACode?: string
  password: string
  recoverPassword?: string
  recoveryEmail?: string
  resetAccountPassword?: string
  step: RecoverSteps
  twoFACode?: string
}

export type AccountRecoveryMagicLinkData = {
  email?: string
  recovery_token?: string
  two_fa_type?: number
  userId?: string
  walletGuid?: string
}

export enum AccountRecoveryApprovalStatusType {
  APPROVED = 'APPROVED',
  INVALID = 'INVALID',
  NOT_APPROVED = 'NOT_APPROVED'
}

export type MetadataRestoreType = any

export type RegisteringFailureType = undefined

export type RegisteringSuccessType = undefined

export type RestoringType = undefined

export type VerifyTwoFAType = {
  code?: string
  email?: string
}

export type SignupStateType = {
  accountRecoveryMagicLinkData: AccountRecoveryMagicLinkData
  accountRecoveryMagicLinkDataEncoded?: string
  accountRecoveryVerify: RemoteDataType<string, any>
  firstLogin: boolean
  isValidReferralCode?: boolean
  kycReset?: boolean
  metadataRestore: RemoteDataType<string, MetadataRestoreType>
  productSignupMetadata?: ProductSignupMetadata
  recoveryTwoFAVerification: RemoteDataType<string, any>
  registerEmail?: string
  registering: RemoteDataType<RegisteringFailureType, RegisteringSuccessType>
  resetAccount: boolean
  restoring: RemoteDataType<string, RestoringType>
  signupCountry?: string
  signupCountryState?: string
}

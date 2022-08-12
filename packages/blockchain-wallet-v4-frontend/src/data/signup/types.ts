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
  CHECK_INBOX = 'CHECK_INBOX',
  CLOUD_RECOVERY = 'CLOUD_RECOVERY',
  FORGOT_PASSWORD_EMAIL = 'FORGOT_PASSWORD_EMAIL',
  RECOVERY_OPTIONS = 'RECOVERY_OPTIONS',
  RECOVERY_PHRASE = 'RECOVERY_PHRASE',
  RESET_ACCOUNT = 'RESET_ACCOUNT',
  RESET_PASSWORD = 'RESET_PASSWORD'
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
  guid?: string
  recovery_token?: string
  two_fa_type?: number
  userId?: string
}

export type MetadataRestoreType = any

export type RegisteringFailureType = undefined

export type RegisteringSuccessType = undefined

export type RestoringType = undefined

export type SignupStateType = {
  accountRecoveryMagicLinkData?: AccountRecoveryMagicLinkData
  accountRecoveryMagicLinkDataEncoded?: string
  firstLogin: boolean
  isValidReferralCode?: boolean
  kycReset?: boolean
  metadataRestore: RemoteDataType<string, MetadataRestoreType>
  productSignupMetadata?: ProductSignupMetadata
  registerEmail?: string
  registering: RemoteDataType<RegisteringFailureType, RegisteringSuccessType>
  resetAccount: boolean
  restoring: RemoteDataType<string, RestoringType>
}

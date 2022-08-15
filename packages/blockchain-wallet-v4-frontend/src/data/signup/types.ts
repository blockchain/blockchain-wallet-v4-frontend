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
  CLOUD_RECOVERY = 'CLOUD_RECOVERY',
  RECOVERY_OPTIONS = 'RECOVERY_OPTIONS',
  RECOVERY_PHRASE = 'RECOVERY_PHRASE',
  RESET_ACCOUNT = 'RESET_ACCOUNT',
  RESET_PASSWORD = 'RESET_PASSWORD'
}

export type RecoverFormType = {
  email?: string
  mnemonic?: string
  password: string
  recoverPassword?: string
  resetAccountPassword?: string
  step: RecoverSteps
}

export type MetadataRestoreType = any

export type RegisteringFailureType = undefined

export type RegisteringSuccessType = undefined

export type RestoringType = undefined

export type SignupStateType = {
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

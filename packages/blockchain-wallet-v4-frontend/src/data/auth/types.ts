import { RemoteDataType } from '@core/types'

export enum ExchangeErrorCodes {
  EMAIL_NOT_VERIFIED = 65,
  WRONG_2FA = 10, // Incorrect 2FA code
  BAD_2FA = 11, // 2FA is undefined/missing from params
  NOT_LINKED = 12,
  UNRECOGNIZED_DEVICE = 99,
  INVALID_CREDENTIALS = 8
}
export enum ProductAuthOptions {
  EXCHANGE = 'EXCHANGE',
  EXPLORER = 'EXPLORER',
  WALLET = 'WALLET'
}

export enum AccountUnificationFlows {
  EXCHANGE_MERGE = 'EXCHANGE_MERGE',
  EXCHANGE_UPGRADE = 'EXCHANGE_UPGRADE',
  MOBILE_EXCHANGE_MERGE = 'MOBILE_EXCHANGE_MERGE',
  MOBILE_EXCHANGE_UPGRADE = 'MOBILE_EXCHANGE_UPGRADE',
  MOBILE_WALLET_MERGE = 'MOBILE_WALLET_MERGE',
  UNIFIED = 'UNIFIED',
  WALLET_MERGE = 'WALLET_MERGE'
}

export enum LoginSteps {
  CHECK_EMAIL = 'CHECK_EMAIL',
  ENTER_EMAIL_GUID = 'ENTER_EMAIL_GUID',
  ENTER_PASSWORD_EXCHANGE = 'ENTER_PASSWORD_EXCHANGE',
  ENTER_PASSWORD_WALLET = 'ENTER_PASSWORD_WALLET',
  INSTITUTIONAL_PORTAL = 'INSTITUTIONAL_PORTAL',
  LOADING = 'LOADING',
  PRODUCT_PICKER_AFTER_AUTHENTICATION = 'PRODUCT_PICKER_AFTER_AUTHENTICATION',
  PRODUCT_PICKER_BEFORE_AUTHENTICATION = 'PRODUCT_PICKER_BEFORE_AUTHENTICATION',
  TWO_FA_EXCHANGE = 'TWO_FA_EXCHANGE',
  TWO_FA_WALLET = 'TWO_FA_WALLET',
  UPGRADE_CONFIRM = 'UPGRADE_CONFIRM',
  UPGRADE_PASSWORD = 'UPGRADE_PASSWORD',
  UPGRADE_SUCCESS = 'UPGRADE_SUCCESS',
  VERIFY_MAGIC_LINK = 'VERIFY_MAGIC_LINK'
}

export enum PlatformTypes {
  ANDROID = 'ANDROID',
  IOS = 'IOS',
  WEB = 'WEB'
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

export type LoginRoutinePayloadType = {
  country?: string
  email?: string
  firstLogin?: boolean
  recovery?: boolean
  state?: string
}

export type ExchangeLoginType = {
  code?: string
  password?: string
  username: string
}

export type LoginFormType = {
  code?: string
  email?: string
  emailToken?: string
  exchangeEmail?: string
  exchangePassword?: string
  exchangeTwoFA?: string
  guid?: string
  guidOrEmail?: string
  password?: string
  step?: LoginSteps
  twoFA?: number | string
  upgradePassword?: string
}

export enum UserType {
  EXCHANGE = 'EXCHANGE',
  WALLET = 'WALLET',
  WALLET_EXCHANGE_BOTH = 'WALLET_EXCHANGE_BOTH',
  WALLET_EXCHANGE_LINKED = 'WALLET_EXCHANGE_LINKED',
  WALLET_EXCHANGE_NOT_LINKED = 'WALLET_EXCHANGE_NOT_LINKED'
}

export enum WalletPollingResponseType {
  CONTINUE_POLLING = 'CONTINUE_POLLING',
  EXCHANGE_ONLY_LOGIN = 'EXCHANGE_ONLY_LOGIN',
  REQUEST_DENIED = 'REQUEST_DENIED',
  WALLET_INFO_POLLED = 'WALLET_INFO_POLLED'
}

export type AuthMagicLink = {
  exchange?: {
    email?: string
    twoFaMode?: boolean
    user_id?: string
  }
  exchange_auth_url?: string
  mergeable?: boolean | null
  platform_type: PlatformTypes
  product?: ProductAuthOptions
  response_type?: WalletPollingResponseType
  session_id?: string
  unified?: boolean
  upgradeable?: boolean | null
  user_type?: UserType
  wallet?: {
    auth_type?: number
    email: string
    email_code?: string
    exchange?: {
      email?: string
      two_fa_mode?: boolean
      user_id?: string
    }
    guid: string
    has_cloud_backup?: boolean
    is_mobile_setup?: string | boolean
    last_mnemonic_backup?: number | null
    mobile_device_type?: number | null
    nabu?: {
      recovery_eligible?: boolean
      recovery_token?: string
      user_id?: string
    }
  }
}

export type LoginErrorType =
  | {
      auth_type: number
      authorization_required: boolean
      initial_error?: string
      message?: string
    }
  | string

// TODO: define missing types and determine if all of these types are needed/used
export type ExchangeLoginSuccessType = {}

export type ExchangeLoginFailureType = any

export type ExchangeResetPasswordSuccessType = any

export type ExchangeResetPasswordFailureType = any

export type LoginSuccessType = boolean

export type LoginFailureType = string | boolean | undefined

export type MetadataRestoreType = any

export type RegisteringFailureType = undefined

export type RegisteringSuccessType = undefined

export type RestoringType = undefined

export type SecureChannelLoginType = undefined

export type ProductAuthMetadata = {
  platform?: PlatformTypes
  product?: ProductAuthOptions
  redirect?: string
  userType?: string
}

export type AuthStateType = {
  accountUnificationFlow?: AccountUnificationFlows
  auth_type: number
  authorizeVerifyDevice: RemoteDataType<string, any> // TODO: type out auth device API response
  exchangeAuth: {
    exchangeLogin: RemoteDataType<ExchangeLoginFailureType, ExchangeLoginSuccessType>
    exchangeLoginError?: ExchangeErrorCodes
    jwtToken?: string
    resetPassword?: RemoteDataType<string, string>
  }
  firstLogin: boolean
  isAuthenticated: boolean
  isLoggingIn: boolean
  kycReset?: boolean
  login: RemoteDataType<LoginFailureType, LoginSuccessType>
  magicLinkData?: AuthMagicLink
  magicLinkDataEncoded?: string
  manifestFile: null
  metadataRestore: RemoteDataType<string, MetadataRestoreType>
  mobileLoginStarted: boolean
  productAuthMetadata: ProductAuthMetadata
  registerEmail?: string
  registering: RemoteDataType<RegisteringFailureType, RegisteringSuccessType>
  resetAccount: boolean
  restoring: RemoteDataType<string, RestoringType>
  secureChannelLogin: RemoteDataType<string, SecureChannelLoginType>
}

//
// mobile message types
//
export type MobileAuthConnectedMessage = {
  status: 'connected'
}

export type MobileAuthWalletMergeMessage = {
  data?: {
    guid: string
    password: string
    sessionId: string
  }
  error?: string
  status: 'error' | 'success'
}

export type MobileAuthExchangeMessage = {
  data?: {
    csrf: string
    jwt: string
  }
  error?: string
  status: 'error' | 'success'
}

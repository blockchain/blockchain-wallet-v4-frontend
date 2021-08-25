import * as AT from './actionTypes'

export enum LoginSteps {
  CHECK_EMAIL = 'CHECK_EMAIL',
  ENTER_EMAIL_GUID = 'ENTER_EMAIL_GUID',
  ENTER_PASSWORD = 'ENTER_PASSWORD',
  LOADING = 'LOADING',
  VERIFICATION_MOBILE = 'VERIFICATION_MOBILE'
}

export enum RecoverSteps {
  CLOUD_RECOVERY = 'CLOUD_RECOVERY',
  RECOVERY_OPTIONS = 'RECOVERY_OPTIONS',
  RECOVERY_PHRASE = 'RECOVERY_PHRASE',
  RESET_ACCOUNT = 'RESET_ACCOUNT',
  RESET_PASSWORD = 'RESET_PASSWORD'
}

export type RecoverFormType = {
  password: string
  step: RecoverSteps
}

export type LoginPayloadType = {
  code: string
  guid: string
  mobileLogin: boolean
  password: string
  sharedKey: string
}

export type LoginFormType = {
  email: string
  emailToken?: string
  guid: string
  guidOrEmail: string
  password: string
  step: LoginSteps
  twoFA?: number | string
}

export type WalletDataFromMagicLink = {
  exchange?: {
    email?: string
    twoFaMode?: boolean
    user_id?: string
  }
  mergeable?: boolean | null
  upgradeable?: boolean | null
  wallet: {
    auth_type?: number
    email: string
    email_code?: string
    exchange?: {
      email?: string
      twoFaMode?: boolean
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

// TODO: this is here to handle old version of magic link
// Can be removed when it's completely deprecated
export type WalletDataFromMagicLinkLegacy = {
  email: string
  email_code?: string
  guid: string
  is_mobile_setup: string | boolean
  mobile_device_type: number | null
}

// actions

interface LoginFailureActionType {
  payload: {
    err?: string
  }
  type: typeof AT.LOGIN_FAILURE
}
interface InitializeLoginSuccessActionType {
  type: typeof AT.INITIALIZE_LOGIN_SUCCESS
}

interface InitializeLoginLoadingActionType {
  type: typeof AT.INITIALIZE_LOGIN_LOADING
}

interface InitializeLoginFailureActionType {
  type: typeof AT.INITIALIZE_LOGIN_FAILURE
}

interface LoginRouteSagaActionType {
  payload: {
    email?: string
    firstLogin?: boolean
    mobileLogin?: boolean
  }
  type: typeof AT.LOGIN_ROUTINE_SAGA
}

interface TriggerWalletMagicLinkSuccessActionType {
  type: typeof AT.TRIGGER_WALLET_MAGIC_LINK_SUCCESS
}

interface TriggerWalletMagicLinkLoadingActionType {
  type: typeof AT.TRIGGER_WALLET_MAGIC_LINK_LOADING
}

interface TriggerWalletMagicLinkFailureActionType {
  type: typeof AT.TRIGGER_WALLET_MAGIC_LINK_FAILURE
}

interface SetMagicLinkInfoActionType {
  payload: {
    magicLinkInfo: WalletDataFromMagicLink
  }
  type: typeof AT.SET_MAGIC_LINK_INFO
}

interface UpgradeWalletActionType {
  payload: {
    version: number
  }
  type: typeof AT.UPGRADE_WALLET
}

export type AuthActionTypes =
  | LoginFailureActionType
  | LoginRouteSagaActionType
  | InitializeLoginFailureActionType
  | InitializeLoginLoadingActionType
  | InitializeLoginSuccessActionType
  | SetMagicLinkInfoActionType
  | TriggerWalletMagicLinkFailureActionType
  | TriggerWalletMagicLinkLoadingActionType
  | TriggerWalletMagicLinkSuccessActionType
  | UpgradeWalletActionType

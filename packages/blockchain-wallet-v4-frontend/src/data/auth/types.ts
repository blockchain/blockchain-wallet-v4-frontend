import * as AT from './actionTypes'

export enum LoginSteps {
  CHECK_EMAIL = 'CHECK_EMAIL',
  ENTER_EMAIL_GUID = 'ENTER_EMAIL_GUID',
  ENTER_PASSWORD = 'ENTER_PASSWORD',
  LOADING = 'LOADING',
  VERIFICATION_MOBILE = 'VERIFICATION_MOBILE'
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
  | TriggerWalletMagicLinkFailureActionType
  | TriggerWalletMagicLinkLoadingActionType
  | TriggerWalletMagicLinkSuccessActionType
  | UpgradeWalletActionType

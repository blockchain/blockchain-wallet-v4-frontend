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

export type LoginObject = {
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
interface InitalizeLoginSuccessActionType {
  type: typeof AT.INTIALIZE_LOGIN_SUCCESS
}

interface InitializeLoginLoadingActionType {
  type: typeof AT.INTIALIZE_LOGIN_LOADING
}

interface InitializeLoginFailureActionType {
  type: typeof AT.INTIALIZE_LOGIN_FAILURE
}

interface LoginGuidSuccessActionType {
  type: typeof AT.LOGIN_GUID_SUCCESS
}

interface LoginGuidLoadingActionType {
  type: typeof AT.LOGIN_GUID_LOADING
}

interface LoginGuidFailureActionType {
  type: typeof AT.LOGIN_GUID_FAILURE
}

interface UpgradeWalletActionType {
  payload: {
    version: number
  }
  type: typeof AT.UPGRADE_WALLET
}

interface WalletGuidSubmitSuccessActionType {
  type: typeof AT.GUID_WALLET_SUCCESS
}

interface WalletGuidSubmitLoadingActionType {
  type: typeof AT.GUID_WALLET_LOADING
}

interface WalletGuidSubmitFailureActionType {
  type: typeof AT.GUID_WALLET_FAILURE
}

export type AuthActionTypes =
  | LoginFailureActionType
  | InitializeLoginFailureActionType
  | InitializeLoginLoadingActionType
  | InitalizeLoginSuccessActionType
  | LoginGuidFailureActionType
  | LoginGuidLoadingActionType
  | LoginGuidSuccessActionType
  | UpgradeWalletActionType
  | WalletGuidSubmitSuccessActionType
  | WalletGuidSubmitLoadingActionType
  | WalletGuidSubmitFailureActionType

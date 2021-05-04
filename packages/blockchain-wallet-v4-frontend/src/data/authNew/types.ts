import * as AT from './actionTypes'

export enum LoginSteps {
  CHECK_EMAIL = 'CHECK_EMAIL',
  ENTER_EMAIL_GUID = 'ENTER_EMAIL_GUID',
  ENTER_PASSWORD = 'ENTER_PASSWORD',
  ENTER_TWO_FACTOR = 'ENTER_TWO_FACTOR',
  LOADING = 'LOADING',
  VERIFICATION_MOBILE = 'VERIFICATION_MOBILE'
}

export type LoginFormType = {
  email: string
  guid: string
  guidOrEmail: string
  password: string
  step: LoginSteps
  twoFA?: number | string
}

export type LoginObject = {
  email: string
  email_code: string
  guid: string
  is_mobile_setup: string | boolean
}

// actions

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

export type AuthNewActionTypes =
  | InitializeLoginFailureActionType
  | InitializeLoginLoadingActionType
  | InitalizeLoginSuccessActionType
  | LoginGuidFailureActionType
  | LoginGuidLoadingActionType
  | LoginGuidSuccessActionType

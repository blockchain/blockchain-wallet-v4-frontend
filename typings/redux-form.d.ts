import { FormAction, InitializeOptions } from 'redux-form'

export type WalletFormType =
  | '@SEND.BCH.FORM'
  | '@SEND.BTC.FORM'
  | '@SEND.ETH.FORM'
  | '@SEND.XLM.FORM'
  | 'borrowForm'
  | 'cancelSBOrderForm'
  | 'repayLoanForm'
  | 'sbCheckoutConfirm'
  | 'simpleBuyCheckout'
  | 'transactionReport'
  | 'walletTxSearch'

declare module 'redux-form' {
  /* eslint-disable */
  export function initialize(
    form: WalletFormType,
    data: any,
    keepDirty?: boolean,
    options?: Partial<InitializeOptions>
  ): FormAction
  export function initialize(
    form: WalletFormType,
    data: any,
    options?: Partial<InitializeOptions>
  ): FormAction
  /* eslint-enable */
  export function registerField(
    form: WalletFormType,
    name: string,
    type: FieldType
  ): FormAction
  export function reset(form: WalletFormType): FormAction
  export function resetSection(
    form: WalletFormType,
    ...sections: string[]
  ): FormAction
  export function startAsyncValidation(form: WalletFormType): FormAction
  export function stopAsyncValidation(
    form: WalletFormType,
    errors?: any
  ): FormAction
  export function setSubmitFailed(
    form: WalletFormType,
    ...fields: string[]
  ): FormAction
  export function setSubmitSucceeded(
    form: WalletFormType,
    ...fields: string[]
  ): FormAction
  export function startSubmit(form: WalletFormType): FormAction
  export function stopSubmit(form: WalletFormType, errors?: any): FormAction
  export function submit(form: WalletFormType): FormAction
  export function clearSubmit(form: WalletFormType): FormAction
  export function clearSubmitErrors(form: WalletFormType): FormAction
  export function clearAsyncError(
    form: WalletFormType,
    field: string
  ): FormAction
  export function clearFields(
    form: WalletFormType,
    keepTouched: boolean,
    persistentSubmitErrors: boolean,
    ...fields: string[]
  ): FormAction
  export function touch(form: WalletFormType, ...fields: string[]): FormAction
  export function unregisterField(
    form: WalletFormType,
    name: string
  ): FormAction
  export function untouch(form: WalletFormType, ...fields: string[]): FormAction
  export function updateSyncErrors(
    from: string,
    syncErrors: FormErrors<FormData>,
    error: any
  ): FormAction
  export function updateSyncWarnings(
    form: WalletFormType,
    syncWarnings: FormWarnings<FormData>,
    warning: any
  ): FormAction

  export interface ConfigProps {
    form: WalletFormType
  }
}

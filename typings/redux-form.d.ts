import {
  ConfigProps,
  FormAction,
  FormDecorator,
  GetFormState,
  InitializeOptions,
  // eslint-disable-next-line import/no-extraneous-dependencies
} from 'redux-form'

export type WalletFormType =
  | '@SEND.BCH.FORM'
  | '@SEND.BTC.FORM'
  | '@SEND.ETH.FORM'
  | '@SEND.XLM.FORM'
  | 'addCCForm'
  | 'airdropClaim'
  | 'borrowForm'
  | 'brokerageTx'
  | 'cancelSBOrderForm'
  | 'ccBillingAddress'
  | 'confirmCustodyWithdraw'
  | 'confirmRecoveryWords'
  | 'custodyWithdrawForm'
  | 'initBorrow'
  | 'initSwap'
  | 'interestDepositForm'
  | 'interestHistoryCoin'
  | 'interestWithdrawalForm'
  | 'linkBankForm'
  | 'linkedBanks'
  | 'linkedCards'
  | 'login'
  | 'previewSwap'
  | 'previewSell'
  | 'prices'
  | 'priceChartCoin'
  | 'register'
  | 'repayLoanForm'
  | 'requestCrypto'
  | 'sbCheckoutConfirm'
  | 'sbCurrencySelection'
  | 'sbCryptoSelection'
  | 'sbPaymentMethods'
  | 'sbChangeEmail'
  | 'settingsNotifications'
  | 'simpleBuyCheckout'
  | 'swapAmount'
  | 'swapOrderDetails'
  | 'transferEth'
  | 'transactionReport'
  | 'walletGuidReminder'
  | 'wallet2faReset'
  | 'walletTxSearch'

declare module 'redux-form' {
  /* eslint-disable */

  export function arrayInsert(
    form: WalletFormType,
    field: string,
    index: number,
    value: any
  ): FormAction
  export function arrayMove(
    form: WalletFormType,
    field: string,
    from: number,
    to: number
  ): FormAction
  export function arrayPop(form: WalletFormType, field: string): FormAction
  export function arrayPush(
    form: WalletFormType,
    field: string,
    value: any
  ): FormAction
  export function arrayRemove(
    form: WalletFormType,
    field: string,
    index: number
  ): FormAction
  export function arrayRemoveAll(
    form: WalletFormType,
    field: string
  ): FormAction
  export function arrayShift(form: WalletFormType, field: string): FormAction
  export function arraySplice(
    form: WalletFormType,
    field: string,
    index: number,
    removeNum: number,
    value: any
  ): FormAction
  export function arraySwap(
    form: WalletFormType,
    field: string,
    indexA: number,
    indexB: number
  ): FormAction
  export function arrayUnshift(
    form: WalletFormType,
    field: string,
    value: any
  ): FormAction
  export function autofill(
    form: WalletFormType,
    field: string,
    value: any
  ): FormAction
  export function blur(
    form: WalletFormType,
    field: string,
    value: any,
    touch?: boolean
  ): FormAction
  export function change(
    form: WalletFormType,
    field: string,
    value: any,
    touch?: boolean,
    persistentSubmitErrors?: boolean
  ): FormAction
  export function destroy(...form: WalletFormType[]): FormAction
  export function focus(form: WalletFormType, field: string): FormAction
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
  export function registerField(form: WalletFormType, name: string, type: FieldType): FormAction
  export function reset(form: WalletFormType): FormAction
  export function resetSection(form: WalletFormType, ...sections: string[]): FormAction
  export function startAsyncValidation(form: WalletFormType): FormAction
  export function stopAsyncValidation(form: WalletFormType, errors?: any): FormAction
  export function setSubmitFailed(form: WalletFormType, ...fields: string[]): FormAction
  export function setSubmitSucceeded(form: WalletFormType, ...fields: string[]): FormAction
  export function startSubmit(form: WalletFormType): FormAction
  export function stopSubmit(form: WalletFormType, errors?: any): FormAction
  export function submit(form: WalletFormType): FormAction
  export function clearSubmit(form: WalletFormType): FormAction
  export function clearSubmitErrors(form: WalletFormType): FormAction
  export function clearAsyncError(form: WalletFormType, field: string): FormAction
  export function clearFields(
    form: WalletFormType,
    keepTouched: boolean,
    persistentSubmitErrors: boolean,
    ...fields: string[]
  ): FormAction
  export function touch(form: WalletFormType, ...fields: string[]): FormAction
  export function unregisterField(form: WalletFormType, name: string): FormAction
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

  export type DataSelector<FormData = {}, State = {}> = (
    formName: WalletFormType,
    getFormState?: GetFormState
  ) => (state: State) => FormData
  export type ErrorSelector<FormData = {}, State = {}> = (
    formName: WalletFormType,
    getFormState?: GetFormState
  ) => (state: State) => FormErrors<FormData>
  export type BooleanSelector<State = {}> = (
    formName: WalletFormType,
    getFormState?: GetFormState
  ) => (state: State) => boolean
  export type NamesSelector<State = {}> = (
    getFormState?: GetFormState
  ) => (state: State) => string[]
  export type FormOrFieldsBooleanSelector<State = {}> = (
    formName: WalletFormType,
    getFormState?: GetFormState
  ) => (state: State, ...fields: string[]) => boolean

  export const getFormValues: DataSelector
  export const getFormInitialValues: DataSelector
  export const getFormSyncErrors: ErrorSelector
  export const getFormMeta: DataSelector
  export const getFormAsyncErrors: ErrorSelector
  export const getFormSyncWarnings: ErrorSelector
  export const getFormSubmitErrors: ErrorSelector
  export const getFormError: ErrorSelector
  export const getFormNames: NamesSelector
  export const isDirty: FormOrFieldsBooleanSelector
  export const isPristine: FormOrFieldsBooleanSelector
  export const isValid: BooleanSelector
  export const isInvalid: BooleanSelector
  export const isSubmitting: BooleanSelector
  export const isAsyncValidating: BooleanSelector
  export const hasSubmitSucceeded: BooleanSelector
  export const hasSubmitFailed: BooleanSelector

  interface CustomConfigProps<FormData = {}, P = {}, ErrorType = string> extends ConfigProps {
    form: WalletFormType
  }

  // 🚨
  // Make sure to keep this updated with @types/redux-form/lib/reduxForm
  // Changing ConfigProps to CustomConfigProps to keep form name typesafety
  /* eslint-disable */

  export function reduxForm<FormData = {}, P = {}, ErrorType = string>(
    config: CustomConfigProps<FormData, P, ErrorType>
  ): FormDecorator<
    FormData,
    P,
    Partial<CustomConfigProps<FormData, P, ErrorType>>,
    ErrorType
  >

  export function reduxForm<FormData = {}, P = {}, ErrorType = string>(
    config: Partial<CustomConfigProps<FormData, P, ErrorType>>
  ): FormDecorator<
    FormData,
    P,
    CustomConfigProps<FormData, P, ErrorType>,
    ErrorType
  >
  /* eslint-enable */
}

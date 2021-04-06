import {
  AccountTypes,
  CoinType,
  FiatType,
  InterestAccountBalanceType,
  InterestAccountType,
  InterestAfterTransactionType,
  InterestEligibleType,
  InterestInstrumentsType,
  InterestLimitsType,
  InterestRateType,
  InterestTransactionType,
  PaymentValue,
  RemoteDataType,
  WithdrawalMinimumType
} from 'blockchain-wallet-v4/src/types'

import * as AT from './actionTypes'

//
// Types
//
export type InterestDepositFormType = {
  agreement: boolean
  depositAmount: number
  interestDepositAccount: AccountTypes
  loanTimeFrame: 'long' | 'short'
  terms: boolean
}

export type InterestMinMaxType = {
  maxCoin: number
  maxFiat: number
  minCoin: number
  minFiat: number
}

export type InterestWithdrawalFormType = {
  interestWithdrawalAccount: AccountTypes
  withdrawalAmount: number
}

export enum InterestSteps {
  'ACCOUNT_SUMMARY',
  'DEPOSIT',
  'DEPOSIT_SUCCESS',
  'WITHDRAWAL'
}

export type InterestStepMetadata = {
  depositSuccess?: boolean
  error?: string
  withdrawSuccess?: boolean
}

export type InterestStep = keyof typeof InterestSteps

//
// State
//
export interface InterestState {
  account: RemoteDataType<string, InterestAccountType>
  accountBalance: RemoteDataType<string, InterestAccountBalanceType>
  afterTransaction: RemoteDataType<string, InterestAfterTransactionType>
  coin: CoinType
  depositLimits: InterestMinMaxType
  instruments: RemoteDataType<string, InterestInstrumentsType>
  interestEligible: RemoteDataType<string, InterestEligibleType>
  interestLimits: RemoteDataType<string, InterestLimitsType>
  interestRate: RemoteDataType<string, InterestRateType['rates']>
  isCoinDisplayed: boolean
  isFromBuySell: boolean
  // make this optional here. places where ts doesnt like it, check, custodial
  payment?: RemoteDataType<string, PaymentValue | undefined>
  step: {
    data: InterestStepMetadata
    name: InterestStep
  }
  transactions: Array<InterestTransactionType>
  transactionsNextPage: string | null
  withdrawalMinimums: RemoteDataType<string, WithdrawalMinimumType>
}

//
// Actions
//

// BALANCES
interface FetchInterestBalanceFailure {
  payload: { error: string }
  type: typeof AT.FETCH_INTEREST_BALANCE_FAILURE
}
interface FetchInterestBalanceLoading {
  type: typeof AT.FETCH_INTEREST_BALANCE_LOADING
}
interface FetchInterestBalanceSuccess {
  payload: { interestAccountBalance: InterestAccountBalanceType }
  type: typeof AT.FETCH_INTEREST_BALANCE_SUCCESS
}

// ELIGIBLE
interface FetchInterestEligibleFailure {
  payload: { error: string }
  type: typeof AT.FETCH_INTEREST_ELIGIBLE_FAILURE
}
interface FetchInterestEligibleLoading {
  type: typeof AT.FETCH_INTEREST_ELIGIBLE_LOADING
}
interface FetchInterestEligibleSuccess {
  payload: { interestEligible: InterestEligibleType }
  type: typeof AT.FETCH_INTEREST_ELIGIBLE_SUCCESS
}

// INSTRUMENTS
interface FetchInterestInstrumentsFailure {
  payload: { error: string }
  type: typeof AT.FETCH_INTEREST_INSTRUMENTS_FAILURE
}
interface FetchInterestInstrumentsLoading {
  type: typeof AT.FETCH_INTEREST_INSTRUMENTS_LOADING
}
interface FetchInterestInstrumentsSuccess {
  payload: { interestInstruments: InterestInstrumentsType }
  type: typeof AT.FETCH_INTEREST_INSTRUMENTS_SUCCESS
}

// LIMITS
interface FetchInterestLimitsFailure {
  payload: { error: string }
  type: typeof AT.FETCH_INTEREST_LIMITS_FAILURE
}
interface FetchInterestLimitsLoading {
  type: typeof AT.FETCH_INTEREST_LIMITS_LOADING
}
interface FetchInterestLimitsSuccess {
  payload: { interestLimits: InterestLimitsType }
  type: typeof AT.FETCH_INTEREST_LIMITS_SUCCESS
}

interface SetWithdrawalMinimumsFailure {
  payload: { error: string }
  type: typeof AT.SET_WITHDRAWAL_MINIMUMS_FAILURE
}
interface SetWithdrawalMinimumsLoading {
  type: typeof AT.SET_WITHDRAWAL_MINIMUMS_LOADING
}
interface SetWithdrawalMinimumsSuccess {
  payload: { withdrawalMinimums: WithdrawalMinimumType }
  type: typeof AT.SET_WITHDRAWAL_MINIMUMS_SUCCESS
}

// ACCOUNT
interface fetchInterestAccountFailure {
  payload: { error: string }
  type: typeof AT.FETCH_INTEREST_PAYMENT_ACCOUNT_FAILURE
}
interface fetchInterestAccountLoading {
  type: typeof AT.FETCH_INTEREST_PAYMENT_ACCOUNT_LOADING
}
interface fetchInterestAccountSuccess {
  payload: { account: InterestAccountType }
  type: typeof AT.FETCH_INTEREST_PAYMENT_ACCOUNT_SUCCESS
}

// INTEREST RATES
interface FetchInterestRateFailure {
  payload: { error: string }
  type: typeof AT.FETCH_INTEREST_RATE_FAILURE
}
interface FetchInterestRateLoading {
  type: typeof AT.FETCH_INTEREST_RATE_LOADING
}
interface FetchInterestRateSuccess {
  payload: { interestRate: InterestRateType }
  type: typeof AT.FETCH_INTEREST_RATE_SUCCESS
}

// TRANSACTIONS
interface FetchInterestTransactionsFailure {
  payload: { error: string }
  type: typeof AT.FETCH_INTEREST_TRANSACTIONS_FAILURE
}
interface FetchInterestTransactionsLoading {
  payload: { coin?: CoinType; reset: boolean }
  type: typeof AT.FETCH_INTEREST_TRANSACTIONS_LOADING
}
interface FetchInterestTransactionsSuccess {
  payload: {
    reset: boolean
    transactions: Array<InterestTransactionType>
  }
  type: typeof AT.FETCH_INTEREST_TRANSACTIONS_SUCCESS
}
interface SetTransactionsNextPage {
  payload: {
    nextPage: string | null
  }
  type: typeof AT.SET_TRANSACTIONS_NEXT_PAGE
}

// DEPOSIT
interface InitializeDepositModalAction {
  type: typeof AT.INITIALIZE_DEPOSIT_MODAL
}
interface InitializeDepositFormAction {
  payload: { coin: CoinType; currency: FiatType }
  type: typeof AT.INITIALIZE_DEPOSIT_FORM
}
interface SetDepositLimitsAction {
  payload: {
    limits: InterestMinMaxType
  }
  type: typeof AT.SET_INTEREST_DEPOSIT_LIMITS
}

// WITHDRAWAL
interface InitializeWithdrawalFormAction {
  payload: { coin: CoinType; walletCurrency: FiatType }
  type: typeof AT.INITIALIZE_WITHDRAWAL_FORM
}
interface RequestWithdrawal {
  payload: { coin: CoinType }
  type: typeof AT.ROUTE_TO_TX_HASH
}

// PAYMENTS
interface SetPaymentFailureAction {
  payload: {
    error: string
  }
  type: typeof AT.SET_PAYMENT_FAILURE
}
interface SetPaymentLoadingAction {
  type: typeof AT.SET_PAYMENT_LOADING
}
interface SetPaymentSuccessAction {
  payload: {
    payment: PaymentValue | undefined
  }
  type: typeof AT.SET_PAYMENT_SUCCESS
}

// MISC
interface RouteToTxHash {
  payload: {
    coin: CoinType
    txHash: string
  }
  type: typeof AT.ROUTE_TO_TX_HASH
}
interface SetInterestStep {
  payload: {
    data?: InterestStepMetadata
    name: InterestStep
  }
  type: typeof AT.SET_INTEREST_STEP
}

interface SetCoinDisplay {
  payload: {
    boolean
  }
  type: typeof AT.SET_COIN_DISPLAY
}

interface ShowInterestModal {
  payload: {
    step: InterestStep
  }
  type: typeof AT.SHOW_INTEREST_MODAL
}

// INTEREST CTA AFTER TRANSACTION
interface FetchInterestAfterTransactionFailure {
  payload: { error: string }
  type: typeof AT.FETCH_SHOW_INTEREST_CARD_AFTER_TRANSACTION_FAILURE
}
interface FetchInterestAfterTransactionLoading {
  type: typeof AT.FETCH_SHOW_INTEREST_CARD_AFTER_TRANSACTION_LOADING
}
interface FetchInterestAfterTransactionSuccess {
  payload: { afterTransaction: InterestAfterTransactionType }
  type: typeof AT.FETCH_SHOW_INTEREST_CARD_AFTER_TRANSACTION_SUCCESS
}
interface ResetAfterTransaction {
  type: typeof AT.RESET_SHOW_INTEREST_CARD_AFTER_TRANSACTION
}

export type InterestActionTypes =
  | FetchInterestAfterTransactionFailure
  | FetchInterestAfterTransactionLoading
  | FetchInterestAfterTransactionSuccess
  | ResetAfterTransaction
  | FetchInterestBalanceFailure
  | FetchInterestBalanceLoading
  | FetchInterestBalanceSuccess
  | FetchInterestEligibleFailure
  | FetchInterestEligibleLoading
  | FetchInterestEligibleSuccess
  | FetchInterestInstrumentsFailure
  | FetchInterestInstrumentsLoading
  | FetchInterestInstrumentsSuccess
  | FetchInterestLimitsFailure
  | FetchInterestLimitsLoading
  | FetchInterestLimitsSuccess
  | fetchInterestAccountFailure
  | fetchInterestAccountLoading
  | fetchInterestAccountSuccess
  | FetchInterestRateFailure
  | FetchInterestRateLoading
  | FetchInterestRateSuccess
  | FetchInterestTransactionsFailure
  | FetchInterestTransactionsLoading
  | FetchInterestTransactionsSuccess
  | InitializeDepositModalAction
  | InitializeDepositFormAction
  | InitializeWithdrawalFormAction
  | RequestWithdrawal
  | RouteToTxHash
  | SetInterestStep
  | SetWithdrawalMinimumsFailure
  | SetWithdrawalMinimumsLoading
  | SetWithdrawalMinimumsSuccess
  | ShowInterestModal
  | SetCoinDisplay
  | SetDepositLimitsAction
  | SetPaymentFailureAction
  | SetPaymentLoadingAction
  | SetPaymentSuccessAction
  | SetTransactionsNextPage

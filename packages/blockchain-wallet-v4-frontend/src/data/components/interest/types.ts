import * as AT from './actionTypes'
import {
  AccountTypes,
  CoinType,
  InterestAccountBalanceType,
  InterestAccountType,
  InterestEligibleType,
  InterestInstrumentsType,
  InterestLimitsType,
  InterestRateType,
  InterestTransactionResponseType,
  RemoteDataType
} from 'core/types'

// Types
export type InterestDepositFormType = {
  agreement: boolean
  depositAmount: number
  interestDepositAccount: AccountTypes
  terms: boolean
}

export type InterestWithdrawalFormType = {
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

// State
export interface InterestState {
  account: RemoteDataType<string, InterestAccountType>
  coin: CoinType
  interestAccountBalance: RemoteDataType<string, InterestAccountBalanceType>
  interestEligible: RemoteDataType<string, InterestEligibleType>
  interestInstruments: RemoteDataType<string, InterestInstrumentsType>
  interestLimits: RemoteDataType<string, InterestLimitsType>
  interestRate: RemoteDataType<string, InterestRateType>
  interestTransactions: RemoteDataType<string, InterestTransactionResponseType>
  step: {
    data: InterestStepMetadata
    name: InterestStep
  }
}

// Actions

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

interface FetchInterestTransactionsFailure {
  payload: { error: string }
  type: typeof AT.FETCH_INTEREST_TRANSACTIONS_FAILURE
}
interface FetchInterestTransactionsLoading {
  type: typeof AT.FETCH_INTEREST_TRANSACTIONS_LOADING
}

interface FetchInterestTransactionsSuccess {
  payload: { interestTransactions: InterestTransactionResponseType }
  type: typeof AT.FETCH_INTEREST_TRANSACTIONS_SUCCESS
}

interface InitializeDepositModalAction {
  type: typeof AT.INITIALIZE_DEPOSIT_MODAL
}

interface InitializeDepositFormAction {
  payload: { coin: CoinType }
  type: typeof AT.INITIALIZE_DEPOSIT_FORM
}

interface InitializeWithdrawalFormAction {
  payload: { coin: CoinType }
  type: typeof AT.INITIALIZE_WITHDRAWAL_FORM
}

interface RequestWithdrawal {
  payload: { coin: CoinType }
  type: typeof AT.ROUTE_TO_TX_HASH
}

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

interface ShowInterestModal {
  payload: {
    step: InterestStep
  }
  type: typeof AT.SHOW_INTEREST_MODAL
}

export type InterestActionTypes =
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
  | RequestWithdrawal
  | RouteToTxHash
  | SetInterestStep
  | ShowInterestModal

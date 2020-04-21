import * as AT from './actionTypes'
import {
  AccountTypes,
  CoinType,
  InterestAccountBalanceType,
  InterestEligibleType,
  InterestInstrumentsType,
  InterestLimitsType,
  InterestPaymentAccountType,
  RemoteDataType
} from 'core/types'

// Types
export type InterestFormValuesType = {
  agreement: boolean
  depositAmount: number
  'interest-deposit-select': AccountTypes
  terms: boolean
}

export enum InterestSteps {
  'DEPOSIT'
}

// State
export interface InterestState {
  account: RemoteDataType<string, InterestPaymentAccountType>
  coin: CoinType
  interestAccountBalance: RemoteDataType<string, InterestAccountBalanceType>
  interestEligible: RemoteDataType<string, InterestEligibleType>
  interestInstruments: RemoteDataType<string, InterestInstrumentsType>
  interestLimits: RemoteDataType<string, InterestLimitsType>
}

// Actions

interface FetchInterestBalanceFailure {
  payload: {
    error: string
  }
  type: typeof AT.FETCH_INTEREST_BALANCE_FAILURE
}
interface FetchInterestBalanceLoading {
  type: typeof AT.FETCH_INTEREST_BALANCE_LOADING
}

interface FetchInterestBalanceSuccess {
  payload: {
    interestAccountBalance: InterestAccountBalanceType
  }
  type: typeof AT.FETCH_INTEREST_BALANCE_SUCCESS
}
interface FetchInterestEligibleFailure {
  payload: {
    error: string
  }
  type: typeof AT.FETCH_INTEREST_ELIGIBLE_FAILURE
}
interface FetchInterestEligibleLoading {
  type: typeof AT.FETCH_INTEREST_ELIGIBLE_LOADING
}
interface FetchInterestEligibleSuccess {
  payload: {
    interestEligible: InterestEligibleType
  }
  type: typeof AT.FETCH_INTEREST_ELIGIBLE_SUCCESS
}

interface FetchInterestInstrumentsFailure {
  payload: {
    error: string
  }
  type: typeof AT.FETCH_INTEREST_INSTRUMENTS_FAILURE
}
interface FetchInterestInstrumentsLoading {
  type: typeof AT.FETCH_INTEREST_INSTRUMENTS_LOADING
}
interface FetchInterestInstrumentsSuccess {
  payload: {
    interestInstruments: InterestInstrumentsType
  }
  type: typeof AT.FETCH_INTEREST_INSTRUMENTS_SUCCESS
}

interface FetchInterestLimitsFailure {
  payload: {
    error: string
  }
  type: typeof AT.FETCH_INTEREST_LIMITS_FAILURE
}
interface FetchInterestLimitsLoading {
  type: typeof AT.FETCH_INTEREST_LIMITS_LOADING
}
interface FetchInterestLimitsSuccess {
  payload: {
    interestLimits: InterestLimitsType
  }
  type: typeof AT.FETCH_INTEREST_LIMITS_SUCCESS
}

interface FetchInterestPaymentAccountFailure {
  payload: {
    error: string
  }
  type: typeof AT.FETCH_INTEREST_PAYMENT_ACCOUNT_FAILURE
}
interface FetchInterestPaymentAccountLoading {
  type: typeof AT.FETCH_INTEREST_PAYMENT_ACCOUNT_LOADING
}
interface FetchInterestPaymentAccountSuccess {
  payload: {
    account: InterestPaymentAccountType
  }
  type: typeof AT.FETCH_INTEREST_PAYMENT_ACCOUNT_SUCCESS
}

interface InitializeInterestAction {
  payload: {
    coin: CoinType
  }
  type: typeof AT.INITIALIZE_INTEREST
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
  | FetchInterestPaymentAccountFailure
  | FetchInterestPaymentAccountLoading
  | FetchInterestPaymentAccountSuccess
  | InitializeInterestAction

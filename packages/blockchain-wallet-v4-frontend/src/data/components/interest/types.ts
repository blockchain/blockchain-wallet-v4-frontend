import * as AT from './actionTypes'
import {
  AccountTypes,
  CoinType,
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

export type InterestModalName = 'deposit' | 'details'

// State
export interface InterestState {
  account: RemoteDataType<string, InterestPaymentAccountType>
  coin: CoinType
  interestEligible: RemoteDataType<string, InterestEligibleType>
  interestInstruments: RemoteDataType<string, InterestInstrumentsType>
  interestLimits: RemoteDataType<string, InterestLimitsType>
  modalName: InterestModalName
}

// Actions
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

interface SetInterestModalName {
  payload: {
    modalName: InterestModalName
  }
  type: typeof AT.SET_INTEREST_MODAL_NAME
}

interface ShowInterestModal {
  payload: {
    modalName: InterestModalName
  }
  type: typeof AT.SHOW_INTEREST_MODAL
}

export type InterestActionTypes =
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
  | SetInterestModalName
  | ShowInterestModal

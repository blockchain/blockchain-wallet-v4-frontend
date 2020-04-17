import * as AT from './actionTypes'
import {
  AccountTypes,
  CoinType,
  InterestEligibleType,
  InterestLimitsType,
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
  coin: CoinType
  interestEligible: RemoteDataType<string, InterestEligibleType>
  interestLimits: RemoteDataType<string, InterestLimitsType>
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

interface InitializeInterestAction {
  payload: {
    coin: CoinType
  }
  type: typeof AT.INITIALIZE_INTEREST
}

export type InterestActionTypes =
  | FetchInterestEligibleFailure
  | FetchInterestEligibleLoading
  | FetchInterestEligibleSuccess
  | FetchInterestLimitsFailure
  | FetchInterestLimitsLoading
  | FetchInterestLimitsSuccess
  | InitializeInterestAction

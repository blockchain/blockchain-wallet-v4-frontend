import * as AT from './actionTypes'
import {
  CurrenciesType,
  FiatEligibleType,
  NabuApiErrorType,
  RemoteDataType,
  SBPairType,
  SBSuggestedAmountType
} from 'core/types'

// Types
export type SBEnterAmountFormValuesType = {
  amount: string
  pair?: SBPairType
}
export type SBCurrencySelectFormType = {
  search: string
}
export enum SimpleBuyStepType {
  'CURRENCY_SELECTION',
  'ENTER_AMOUNT'
}

// State
export type SimpleBuyState = {
  fiatCurrency: null | keyof CurrenciesType
  fiatEligible: RemoteDataType<NabuApiErrorType, FiatEligibleType>
  pairs: RemoteDataType<NabuApiErrorType, Array<SBPairType>>
  step: keyof typeof SimpleBuyStepType
  suggestedAmounts: RemoteDataType<
    Error | NabuApiErrorType,
    SBSuggestedAmountType
  >
}

// Actions
interface FetchSBFiatEligible {
  payload: {
    currency: keyof CurrenciesType
  }
  type: typeof AT.FETCH_SB_FIAT_ELIGIBLE
}

interface FetchSBFiatEligibleFailure {
  payload: {
    error: NabuApiErrorType
  }
  type: typeof AT.FETCH_SB_FIAT_ELIGIBLE_FAILURE
}

interface FetchSBFiatEligibleLoading {
  type: typeof AT.FETCH_SB_FIAT_ELIGIBLE_LOADING
}

interface FetchSBFiatEligibleSuccess {
  payload: {
    fiatEligible: FiatEligibleType
  }
  type: typeof AT.FETCH_SB_FIAT_ELIGIBLE_SUCCESS
}
interface FetchSBPairs {
  payload: {
    currency: keyof CurrenciesType
  }
  type: typeof AT.FETCH_SB_PAIRS
}

interface FetchSBPairsFailure {
  payload: {
    error: NabuApiErrorType
  }
  type: typeof AT.FETCH_SB_PAIRS_FAILURE
}

interface FetchSBPairsLoading {
  type: typeof AT.FETCH_SB_PAIRS_LOADING
}

interface FetchSBPairsSuccess {
  payload: {
    pairs: Array<SBPairType>
  }
  type: typeof AT.FETCH_SB_PAIRS_SUCCESS
}

interface FetchSBSuggestedAmounts {
  payload: {
    currency: keyof CurrenciesType
  }
  type: typeof AT.FETCH_SB_SUGGESTED_AMOUNTS
}

interface FetchSBSuggestedAmountsFailure {
  payload: {
    error: Error | NabuApiErrorType
  }
  type: typeof AT.FETCH_SB_SUGGESTED_AMOUNTS_FAILURE
}

interface FetchSBSuggestedAmountsLoading {
  type: typeof AT.FETCH_SB_SUGGESTED_AMOUNTS_LOADING
}

interface FetchSBSuggestedAmountsSuccess {
  payload: {
    amounts: SBSuggestedAmountType
  }
  type: typeof AT.FETCH_SB_SUGGESTED_AMOUNTS_SUCCESS
}

interface SetStepAction {
  payload:
    | {
        fiatCurrency: keyof CurrenciesType
        step: 'ENTER_AMOUNT'
      }
    | {
        step: 'CURRENCY_SELECTION'
      }
  type: typeof AT.SET_STEP
}

export type SimpleBuyActionTypes =
  | FetchSBFiatEligible
  | FetchSBFiatEligibleFailure
  | FetchSBFiatEligibleLoading
  | FetchSBFiatEligibleSuccess
  | FetchSBPairs
  | FetchSBPairsFailure
  | FetchSBPairsLoading
  | FetchSBPairsSuccess
  | FetchSBSuggestedAmounts
  | FetchSBSuggestedAmountsFailure
  | FetchSBSuggestedAmountsLoading
  | FetchSBSuggestedAmountsSuccess
  | SetStepAction

import * as AT from './actionTypes'
import { CurrenciesType, NabuApiErrorType, RemoteDataType } from 'core/types'
import { FiatEligibleType, PairType } from 'core/network/api/simpleBuy/types'

// Types

// State
export type SimpleBuyState = {
  fiatEligible: RemoteDataType<NabuApiErrorType, FiatEligibleType>
  pairs: RemoteDataType<NabuApiErrorType, Array<PairType>>
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
    pairs: Array<PairType>
  }
  type: typeof AT.FETCH_SB_PAIRS_SUCCESS
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

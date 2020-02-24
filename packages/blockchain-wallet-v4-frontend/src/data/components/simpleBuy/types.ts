import * as AT from './actionTypes'
import { CurrenciesType, NabuApiErrorType, RemoteDataType } from 'core/types'
import { PairType } from 'core/network/api/simpleBuy/types'

// Types

// State
export type SimpleBuyState = {
  pairs: RemoteDataType<NabuApiErrorType, Array<PairType>>
}

// Actions
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
  | FetchSBPairs
  | FetchSBPairsFailure
  | FetchSBPairsLoading
  | FetchSBPairsSuccess

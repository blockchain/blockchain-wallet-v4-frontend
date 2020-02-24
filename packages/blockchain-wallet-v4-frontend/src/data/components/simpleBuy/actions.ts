import * as AT from './actionTypes'
import { CurrenciesType, NabuApiErrorType } from 'core/types'
import { PairType } from 'core/network/api/simpleBuy/types'
import { SimpleBuyActionTypes } from './types'

export const fetchSBPairs = (currency: keyof CurrenciesType) => ({
  type: AT.FETCH_SB_PAIRS,
  currency
})

export const fetchSBPairsFailure = (
  error: NabuApiErrorType
): SimpleBuyActionTypes => ({
  type: AT.FETCH_SB_PAIRS_FAILURE,
  payload: {
    error
  }
})

export const fetchSBPairsLoading = (): SimpleBuyActionTypes => ({
  type: AT.FETCH_SB_PAIRS_LOADING
})

export const fetchSBPairsSuccess = (
  pairs: Array<PairType>
): SimpleBuyActionTypes => ({
  type: AT.FETCH_SB_PAIRS_SUCCESS,
  payload: {
    pairs
  }
})

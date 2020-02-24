import * as AT from './actionTypes'
import { CurrenciesType, NabuApiErrorType } from 'core/types'
import { PairType } from 'core/network/api/simpleBuy/types'

export const fetchSBPairs = (currency: keyof CurrenciesType) => ({
  type: AT.FETCH_SB_PAIRS
})

export const fetchSBPairsFailure = (error: NabuApiErrorType) => ({
  type: AT.FETCH_SB_PAIRS_FAILURE,
  error
})

export const fetchSBPairsLoading = () => ({
  type: AT.FETCH_SB_PAIRS_LOADING
})

export const fetchSBPairsSuccess = (pairs: Array<PairType>) => ({
  type: AT.FETCH_SB_PAIRS_SUCCESS,
  pairs
})

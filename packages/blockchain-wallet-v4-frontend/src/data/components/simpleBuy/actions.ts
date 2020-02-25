import * as AT from './actionTypes'
import {
  CurrenciesType,
  FiatEligibleType,
  NabuApiErrorType,
  SBPairType
} from 'core/types'
import { SimpleBuyActionTypes } from './types'

export const fetchSBFiatEligible = (currency: keyof CurrenciesType) => ({
  type: AT.FETCH_SB_FIAT_ELIGIBLE,
  currency
})

export const fetchSBFiatEligibleFailure = (
  error: NabuApiErrorType
): SimpleBuyActionTypes => ({
  type: AT.FETCH_SB_FIAT_ELIGIBLE_FAILURE,
  payload: {
    error
  }
})

export const fetchSBFiatEligibleLoading = (): SimpleBuyActionTypes => ({
  type: AT.FETCH_SB_FIAT_ELIGIBLE_LOADING
})

export const fetchSBFiatEligibleSuccess = (
  fiatEligible: FiatEligibleType
): SimpleBuyActionTypes => ({
  type: AT.FETCH_SB_FIAT_ELIGIBLE_SUCCESS,
  payload: {
    fiatEligible
  }
})

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
  pairs: Array<SBPairType>
): SimpleBuyActionTypes => ({
  type: AT.FETCH_SB_PAIRS_SUCCESS,
  payload: {
    pairs
  }
})

export const setStep = (
  payload:
    | { step: 'CURRENCY_SELECTION' }
    | { fiatCurrency: keyof CurrenciesType; step: 'ELIGIBLE_CHECK' }
): SimpleBuyActionTypes => ({
  type: AT.SET_STEP,
  payload:
    payload.step === 'ELIGIBLE_CHECK'
      ? {
          step: payload.step,
          fiatCurrency: payload.fiatCurrency
        }
      : {
          step: payload.step
        }
})

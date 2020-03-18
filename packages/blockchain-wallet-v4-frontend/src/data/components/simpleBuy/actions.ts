import * as AT from './actionTypes'
import {
  CurrenciesType,
  FiatEligibleType,
  NabuApiErrorType,
  SBPairType,
  SBSuggestedAmountType
} from 'core/types'
import { SimpleBuyActionTypes } from './types'

export const destroyCheckout = () => ({
  type: AT.DESTROY_CHECKOUT
})

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

export const fetchSBSuggestedAmounts = (currency: keyof CurrenciesType) => ({
  type: AT.FETCH_SB_SUGGESTED_AMOUNTS,
  currency
})

export const fetchSBSuggestedAmountsFailure = (
  error: Error | NabuApiErrorType
): SimpleBuyActionTypes => ({
  type: AT.FETCH_SB_SUGGESTED_AMOUNTS_FAILURE,
  payload: {
    error
  }
})

export const fetchSBSuggestedAmountsLoading = (): SimpleBuyActionTypes => ({
  type: AT.FETCH_SB_SUGGESTED_AMOUNTS_LOADING
})

export const fetchSBSuggestedAmountsSuccess = (
  amounts: SBSuggestedAmountType
): SimpleBuyActionTypes => ({
  type: AT.FETCH_SB_SUGGESTED_AMOUNTS_SUCCESS,
  payload: {
    amounts
  }
})

export const handleSBSuggestedAmountClick = (amount: string) => ({
  type: AT.HANDLE_SB_SUGGESTED_AMOUNT_CLICK,
  payload: {
    amount
  }
})

export const initializeCheckout = (pairs: Array<SBPairType>) => ({
  type: AT.INITIALIZE_CHECKOUT,
  pairs
})

export const setStep = (
  payload:
    | { step: 'CURRENCY_SELECTION' }
    | { fiatCurrency: keyof CurrenciesType; step: 'ENTER_AMOUNT' }
): SimpleBuyActionTypes => ({
  type: AT.SET_STEP,
  payload:
    payload.step === 'ENTER_AMOUNT'
      ? {
          step: payload.step,
          fiatCurrency: payload.fiatCurrency
        }
      : {
          step: payload.step
        }
})

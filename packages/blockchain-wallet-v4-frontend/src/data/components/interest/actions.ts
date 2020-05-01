import * as AT from './actionTypes'
import { CoinType } from 'core/types'
import {
  InterestAccountBalanceType,
  InterestEligibleType,
  InterestInstrumentsType,
  InterestLimitsType,
  InterestPaymentAccountType,
  InterestRateType,
  InterestTransactionResponseType
} from 'core/network/api/interest/types'
import { InterestActionTypes, InterestStep } from './types'

export const fetchInterestBalance = (coin?: CoinType) => ({
  type: AT.FETCH_INTEREST_BALANCE,
  payload: {
    coin
  }
})

export const fetchInterestBalanceFailure = (
  error: string
): InterestActionTypes => ({
  type: AT.FETCH_INTEREST_BALANCE_FAILURE,
  payload: {
    error
  }
})

export const fetchInterestBalanceLoading = (): InterestActionTypes => ({
  type: AT.FETCH_INTEREST_BALANCE_LOADING
})

export const fetchInterestBalanceSuccess = (
  interestAccountBalance: InterestAccountBalanceType
): InterestActionTypes => ({
  type: AT.FETCH_INTEREST_BALANCE_SUCCESS,
  payload: {
    interestAccountBalance
  }
})

export const fetchInterestEligible = () => ({
  type: AT.FETCH_INTEREST_ELIGIBLE
})
export const fetchInterestEligibleFailure = (
  error: string
): InterestActionTypes => ({
  type: AT.FETCH_INTEREST_ELIGIBLE_FAILURE,
  payload: {
    error
  }
})
export const fetchInterestEligibleLoading = (): InterestActionTypes => ({
  type: AT.FETCH_INTEREST_ELIGIBLE_LOADING
})
export const fetchInterestEligibleSuccess = (
  interestEligible: InterestEligibleType
): InterestActionTypes => ({
  type: AT.FETCH_INTEREST_ELIGIBLE_SUCCESS,
  payload: {
    interestEligible
  }
})

export const fetchInterestInstruments = () => ({
  type: AT.FETCH_INTEREST_INSTRUMENTS
})
export const fetchInterestInstrumentsFailure = (
  error: string
): InterestActionTypes => ({
  type: AT.FETCH_INTEREST_INSTRUMENTS_FAILURE,
  payload: {
    error
  }
})
export const fetchInterestInstrumentsLoading = (): InterestActionTypes => ({
  type: AT.FETCH_INTEREST_INSTRUMENTS_LOADING
})
export const fetchInterestInstrumentsSuccess = (
  interestInstruments: InterestInstrumentsType
): InterestActionTypes => ({
  type: AT.FETCH_INTEREST_INSTRUMENTS_SUCCESS,
  payload: {
    interestInstruments
  }
})

export const fetchInterestLimits = () => ({
  type: AT.FETCH_INTEREST_LIMITS
})
export const fetchInterestLimitsFailure = (
  error: string
): InterestActionTypes => ({
  type: AT.FETCH_INTEREST_LIMITS_FAILURE,
  payload: {
    error
  }
})
export const fetchInterestLimitsLoading = (): InterestActionTypes => ({
  type: AT.FETCH_INTEREST_LIMITS_LOADING
})
export const fetchInterestLimitsSuccess = (
  interestLimits: InterestLimitsType
): InterestActionTypes => ({
  type: AT.FETCH_INTEREST_LIMITS_SUCCESS,
  payload: {
    interestLimits
  }
})

export const fetchInterestPaymentAccount = (coin?: CoinType) => ({
  type: AT.FETCH_INTEREST_PAYMENT_ACCOUNT,
  coin
})
export const fetchInterestPaymentAccountFailure = (
  error: string
): InterestActionTypes => ({
  type: AT.FETCH_INTEREST_PAYMENT_ACCOUNT_FAILURE,
  payload: {
    error
  }
})
export const fetchInterestPaymentAccountLoading = (): InterestActionTypes => ({
  type: AT.FETCH_INTEREST_PAYMENT_ACCOUNT_LOADING
})
export const fetchInterestPaymentAccountSuccess = (
  account: InterestPaymentAccountType
): InterestActionTypes => ({
  type: AT.FETCH_INTEREST_PAYMENT_ACCOUNT_SUCCESS,
  payload: {
    account
  }
})

export const fetchInterestRate = () => ({
  type: AT.FETCH_INTEREST_RATE
})

export const fetchInterestRateFailure = (
  error: string
): InterestActionTypes => ({
  type: AT.FETCH_INTEREST_RATE_FAILURE,
  payload: {
    error
  }
})

export const fetchInterestRateLoading = (): InterestActionTypes => ({
  type: AT.FETCH_INTEREST_RATE_LOADING
})

export const fetchInterestRateSuccess = (
  interestRate: InterestRateType
): InterestActionTypes => ({
  type: AT.FETCH_INTEREST_RATE_SUCCESS,
  payload: {
    interestRate
  }
})

export const fetchInterestTransactions = () => ({
  type: AT.FETCH_INTEREST_TRANSACTIONS
})

export const fetchInterestTransactionsFailue = (
  error: string
): InterestActionTypes => ({
  type: AT.FETCH_INTEREST_TRANSACTIONS_FAILURE,
  payload: {
    error
  }
})

export const fetchInterestTransactionsLoading = (): InterestActionTypes => ({
  type: AT.FETCH_INTEREST_TRANSACTIONS_LOADING
})

export const fetchInterestTransactionsSuccess = (
  interestTransactions: InterestTransactionResponseType
): InterestActionTypes => ({
  type: AT.FETCH_INTEREST_TRANSACTIONS_SUCCESS,
  payload: {
    interestTransactions
  }
})

export const initializeDepositModal = (): InterestActionTypes => ({
  type: AT.INITIALIZE_DEPOSIT_MODAL
})

export const initializeDepositForm = (coin: CoinType) => ({
  payload: {
    coin
  },
  type: AT.INITIALIZE_DEPOSIT_FORM
})

export const submitDepositForm = (coin: CoinType) => ({
  payload: {
    coin
  },
  type: AT.SUBMIT_DEPOSIT_FORM
})

export const setInterestStep = (step: InterestStep) => ({
  payload: {
    step
  },
  type: AT.SET_INTEREST_STEP
})

export const showInterestModal = (step: InterestStep) => ({
  payload: {
    step
  },
  type: AT.SHOW_INTEREST_MODAL
})

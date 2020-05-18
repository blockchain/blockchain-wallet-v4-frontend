import { CoinType, PaymentValue } from 'core/types'
import {
  InterestAccountBalanceType,
  InterestAccountType,
  InterestEligibleType,
  InterestInstrumentsType,
  InterestLimitsType,
  InterestRateType,
  InterestTransactionResponseType
} from 'core/network/api/interest/types'

import * as AT from './actionTypes'
import {
  InterestActionTypes,
  InterestMinMaxType,
  InterestStep,
  InterestStepMetadata
} from './types'

export const fetchInterestBalance = (coin?: CoinType) => ({
  type: AT.FETCH_INTEREST_BALANCE,
  payload: { coin }
})

export const fetchInterestBalanceFailure = (
  error: string
): InterestActionTypes => ({
  type: AT.FETCH_INTEREST_BALANCE_FAILURE,
  payload: { error }
})

export const fetchInterestBalanceLoading = (): InterestActionTypes => ({
  type: AT.FETCH_INTEREST_BALANCE_LOADING
})

export const fetchInterestBalanceSuccess = (
  interestAccountBalance: InterestAccountBalanceType
): InterestActionTypes => ({
  type: AT.FETCH_INTEREST_BALANCE_SUCCESS,
  payload: { interestAccountBalance }
})

export const fetchInterestEligible = () => ({
  type: AT.FETCH_INTEREST_ELIGIBLE
})
export const fetchInterestEligibleFailure = (
  error: string
): InterestActionTypes => ({
  type: AT.FETCH_INTEREST_ELIGIBLE_FAILURE,
  payload: { error }
})
export const fetchInterestEligibleLoading = (): InterestActionTypes => ({
  type: AT.FETCH_INTEREST_ELIGIBLE_LOADING
})
export const fetchInterestEligibleSuccess = (
  interestEligible: InterestEligibleType
): InterestActionTypes => ({
  type: AT.FETCH_INTEREST_ELIGIBLE_SUCCESS,
  payload: { interestEligible }
})

export const fetchInterestInstruments = () => ({
  type: AT.FETCH_INTEREST_INSTRUMENTS
})
export const fetchInterestInstrumentsFailure = (
  error: string
): InterestActionTypes => ({
  type: AT.FETCH_INTEREST_INSTRUMENTS_FAILURE,
  payload: { error }
})
export const fetchInterestInstrumentsLoading = (): InterestActionTypes => ({
  type: AT.FETCH_INTEREST_INSTRUMENTS_LOADING
})
export const fetchInterestInstrumentsSuccess = (
  interestInstruments: InterestInstrumentsType
): InterestActionTypes => ({
  type: AT.FETCH_INTEREST_INSTRUMENTS_SUCCESS,
  payload: { interestInstruments }
})

export const fetchInterestLimits = () => ({
  type: AT.FETCH_INTEREST_LIMITS
})
export const fetchInterestLimitsFailure = (
  error: string
): InterestActionTypes => ({
  type: AT.FETCH_INTEREST_LIMITS_FAILURE,
  payload: { error }
})
export const fetchInterestLimitsLoading = (): InterestActionTypes => ({
  type: AT.FETCH_INTEREST_LIMITS_LOADING
})
export const fetchInterestLimitsSuccess = (
  interestLimits: InterestLimitsType
): InterestActionTypes => ({
  type: AT.FETCH_INTEREST_LIMITS_SUCCESS,
  payload: { interestLimits }
})

export const fetchInterestAccount = (coin?: CoinType) => ({
  type: AT.FETCH_INTEREST_PAYMENT_ACCOUNT,
  coin
})
export const fetchInterestAccountFailure = (
  error: string
): InterestActionTypes => ({
  type: AT.FETCH_INTEREST_PAYMENT_ACCOUNT_FAILURE,
  payload: { error }
})
export const fetchInterestAccountLoading = (): InterestActionTypes => ({
  type: AT.FETCH_INTEREST_PAYMENT_ACCOUNT_LOADING
})
export const fetchInterestAccountSuccess = (
  account: InterestAccountType
): InterestActionTypes => ({
  type: AT.FETCH_INTEREST_PAYMENT_ACCOUNT_SUCCESS,
  payload: { account }
})

export const fetchInterestRate = () => ({
  type: AT.FETCH_INTEREST_RATE
})

export const fetchInterestRateFailure = (
  error: string
): InterestActionTypes => ({
  type: AT.FETCH_INTEREST_RATE_FAILURE,
  payload: { error }
})

export const fetchInterestRateLoading = (): InterestActionTypes => ({
  type: AT.FETCH_INTEREST_RATE_LOADING
})

export const fetchInterestRateSuccess = (
  interestRate: InterestRateType
): InterestActionTypes => ({
  type: AT.FETCH_INTEREST_RATE_SUCCESS,
  payload: { interestRate }
})

export const fetchInterestTransactions = () => ({
  type: AT.FETCH_INTEREST_TRANSACTIONS
})

export const fetchInterestTransactionsFailure = (
  error: string
): InterestActionTypes => ({
  type: AT.FETCH_INTEREST_TRANSACTIONS_FAILURE,
  payload: { error }
})

export const fetchInterestTransactionsLoading = (): InterestActionTypes => ({
  type: AT.FETCH_INTEREST_TRANSACTIONS_LOADING
})

export const fetchInterestTransactionsSuccess = (
  interestTransactions: InterestTransactionResponseType
): InterestActionTypes => ({
  type: AT.FETCH_INTEREST_TRANSACTIONS_SUCCESS,
  payload: { interestTransactions }
})

export const initializeDepositModal = (): InterestActionTypes => ({
  type: AT.INITIALIZE_DEPOSIT_MODAL
})

export const initializeDepositForm = (coin: CoinType) => ({
  payload: { coin },
  type: AT.INITIALIZE_DEPOSIT_FORM
})

export const initializeWithdrawalForm = (coin: CoinType) => ({
  payload: { coin },
  type: AT.INITIALIZE_WITHDRAWAL_FORM
})

export const routeToTxHash = (coin: CoinType, txHash: string) => ({
  payload: { coin, txHash },
  type: AT.ROUTE_TO_TX_HASH
})

export const requestWithdrawal = (
  coin: CoinType,
  withdrawalAmountCrypto: number
) => ({
  payload: { coin, withdrawalAmountCrypto },
  type: AT.REQUEST_WITHDRAWAL
})

export const setInterestStep = (
  name: InterestStep,
  data?: InterestStepMetadata
) => ({
  payload: { name, data },
  type: AT.SET_INTEREST_STEP
})

export const setDepositLimits = (limits: InterestMinMaxType) => ({
  payload: { limits },
  type: AT.SET_INTEREST_DEPOSIT_LIMITS
})

export const setPaymentFailure = (error: string): InterestActionTypes => ({
  type: AT.SET_PAYMENT_FAILURE,
  payload: {
    error
  }
})
export const setPaymentLoading = (): InterestActionTypes => ({
  type: AT.SET_PAYMENT_LOADING
})
export const setPaymentSuccess = (
  payment: PaymentValue
): InterestActionTypes => ({
  type: AT.SET_PAYMENT_SUCCESS,
  payload: {
    payment
  }
})

export const showInterestModal = (step: InterestStep) => ({
  payload: { step },
  type: AT.SHOW_INTEREST_MODAL
})

export const submitDepositForm = (coin: CoinType) => ({
  payload: { coin },
  type: AT.SUBMIT_DEPOSIT_FORM
})

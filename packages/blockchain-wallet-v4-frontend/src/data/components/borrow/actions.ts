import {
  CoinType,
  LoanTransactionsType,
  LoanType,
  OfferType,
  PaymentValue
} from 'blockchain-wallet-v4/src/types'

import * as AT from './actionTypes'
import { BorrowActionTypes, BorrowMinMaxType } from './types'

export const addCollateral = () => ({
  type: AT.ADD_COLLATERAL
})

export const createBorrow = () => ({
  type: AT.CREATE_BORROW
})

export const destroy = () => ({
  type: AT.DESTROY_BORROW
})

export const fetchBorrowOffers = () => ({
  type: AT.FETCH_BORROW_OFFERS
})

export const fetchBorrowOffersLoading = (): BorrowActionTypes => ({
  type: AT.FETCH_BORROW_OFFERS_LOADING
})

export const fetchBorrowOffersFailure = (error): BorrowActionTypes => ({
  type: AT.FETCH_BORROW_OFFERS_FAILURE,
  payload: {
    error
  }
})

export const fetchBorrowOffersSuccess = (offers): BorrowActionTypes => ({
  type: AT.FETCH_BORROW_OFFERS_SUCCESS,
  payload: {
    offers
  }
})

export const fetchLoanTransactions = (loanId: string) => ({
  type: AT.FETCH_LOAN_TRANSACTIONS,
  payload: {
    loanId
  }
})

export const fetchLoanTransactionsLoading = (): BorrowActionTypes => ({
  type: AT.FETCH_LOAN_TRANSACTIONS_LOADING
})

export const fetchLoanTransactionsFailure = (error): BorrowActionTypes => ({
  type: AT.FETCH_LOAN_TRANSACTIONS_FAILURE,
  payload: {
    error
  }
})

export const fetchLoanTransactionsSuccess = (
  transactions: Array<LoanTransactionsType>
): BorrowActionTypes => ({
  type: AT.FETCH_LOAN_TRANSACTIONS_SUCCESS,
  payload: {
    transactions
  }
})

export const fetchUserBorrowHistory = () => ({
  type: AT.FETCH_USER_BORROW_HISTORY
})

export const fetchUserBorrowHistoryLoading = (): BorrowActionTypes => ({
  type: AT.FETCH_USER_BORROW_HISTORY_LOADING
})

export const fetchUserBorrowHistoryFailure = (error): BorrowActionTypes => ({
  type: AT.FETCH_USER_BORROW_HISTORY_FAILURE,
  payload: {
    error
  }
})

export const fetchUserBorrowHistorySuccess = (
  borrowHistory: Array<LoanType>
): BorrowActionTypes => ({
  type: AT.FETCH_USER_BORROW_HISTORY_SUCCESS,
  payload: {
    borrowHistory
  }
})

export const handleAddCollateralRequiredClick = () => ({
  type: AT.AMT_COLLATERAL_REQUIRED_CLICK
})

export const handleMaxCollateralClick = () => ({
  type: AT.MAX_COLLATERAL_CLICK
})

export const initializeBorrow = (coin: CoinType) => ({
  type: AT.INITIALIZE_BORROW,
  payload: {
    coin
  }
})

export const initializeRepayLoan = (coin: CoinType) => ({
  type: AT.INITIALIZE_REPAY_LOAN,
  payload: {
    coin
  }
})

export const repayLoan = () => ({
  type: AT.REPAY_LOAN
})

export const setCoin = (coin: CoinType): BorrowActionTypes => ({
  type: AT.SET_COIN,
  payload: {
    coin
  }
})

export const setLimits = (limits: BorrowMinMaxType): BorrowActionTypes => ({
  type: AT.SET_LIMITS,
  payload: {
    limits
  }
})

export const setPaymentFailure = (
  error: string | Error
): BorrowActionTypes => ({
  type: AT.SET_PAYMENT_FAILURE,
  payload: {
    error
  }
})

export const setPaymentLoading = (): BorrowActionTypes => ({
  type: AT.SET_PAYMENT_LOADING
})

export const setPaymentSuccess = (
  payment: PaymentValue
): BorrowActionTypes => ({
  type: AT.SET_PAYMENT_SUCCESS,
  payload: {
    payment
  }
})

export const setStep = (
  payload:
    | { offer: OfferType; step: 'CHECKOUT' }
    | { offer: OfferType; step: 'CONFIRM' }
    | {
        loan: LoanType
        offer: OfferType
        step: 'DETAILS' | 'ADD_COLLATERAL' | 'REPAY_LOAN'
      }
): BorrowActionTypes => ({
  type: AT.SET_STEP,
  payload:
    payload.step === 'CHECKOUT' || payload.step === 'CONFIRM'
      ? {
          step: payload.step,
          offer: payload.offer
        }
      : {
          step: payload.step,
          loan: payload.loan,
          offer: payload.offer
        }
})

import * as AT from './actionTypes'
import { BorrowActionTypes, BorrowMinMaxType, BorrowStepsType } from './types'
import { CoinType, LoanType, OfferType } from 'blockchain-wallet-v4/src/types'

export const createBorrow = () => ({
  type: AT.CREATE_BORROW
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

export const handleMaxCollateralClick = () => ({
  type: AT.MAX_COLLATERAL_CLICK
})

export const initializeBorrow = (coin: CoinType, offer: OfferType) => ({
  type: AT.INITIALIZE_BORROW,
  payload: {
    coin,
    offer
  }
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

export const setOffer = (offer: OfferType | null): BorrowActionTypes => ({
  type: AT.SET_OFFER,
  payload: {
    offer
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

export const setPaymentSuccess = (payment): BorrowActionTypes => ({
  type: AT.SET_PAYMENT_SUCCESS,
  payload: {
    payment
  }
})

export const setStep = (step: BorrowStepsType): BorrowActionTypes => ({
  type: AT.SET_STEP,
  payload: {
    step
  }
})

import * as AT from './actionTypes'
import { BorrowActionTypes } from './types'
import { CoinType } from 'blockchain-wallet-v4/src/types'

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

export const initializeBorrow = (coin: CoinType) => ({
  type: AT.INITIALIZE_BORROW,
  payload: {
    coin
  }
})

export const handleMaxCollateralClick = () => ({
  type: AT.MAX_COLLATERAL_CLICK
})

export const setPaymentFailure = (error): BorrowActionTypes => ({
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

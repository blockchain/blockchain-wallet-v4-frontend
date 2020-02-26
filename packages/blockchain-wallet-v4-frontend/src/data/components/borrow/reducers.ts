import * as AT from './actionTypes'
import { actions } from 'data'
import { BorrowActionTypes, BorrowState } from './types'
import Remote from 'blockchain-wallet-v4/src/remote/remote'

const INITIAL_STATE: BorrowState = {
  borrowHistory: Remote.NotAsked,
  coin: 'BTC',
  limits: {
    maxFiat: 0,
    minFiat: 0,
    maxCrypto: 0,
    minCrypto: 0
  },
  offer: undefined,
  loan: undefined,
  offers: Remote.NotAsked,
  payment: Remote.NotAsked,
  step: 'CHECKOUT'
}

export function borrowReducer (
  state = INITIAL_STATE,
  action: BorrowActionTypes
): BorrowState {
  switch (action.type) {
    case AT.FETCH_BORROW_OFFERS_LOADING:
      return {
        ...state,
        offers: Remote.Loading
      }
    case AT.FETCH_BORROW_OFFERS_FAILURE:
      return {
        ...state,
        offers: Remote.Failure(action.payload.error)
      }
    case AT.FETCH_BORROW_OFFERS_SUCCESS:
      return {
        ...state,
        offers: Remote.Success(action.payload.offers)
      }
    case AT.FETCH_LOAN_FINANCIALS_LOADING:
      return state.loan
        ? {
            ...state,
            loan: {
              ...state.loan,
              financials: Remote.Loading
            }
          }
        : {
            ...state
          }
    case AT.FETCH_LOAN_FINANCIALS_FAILURE:
      return state.loan
        ? {
            ...state,
            loan: {
              ...state.loan,
              financials: Remote.Failure(action.payload.error)
            }
          }
        : {
            ...state
          }
    case AT.FETCH_LOAN_FINANCIALS_SUCCESS:
      return state.loan
        ? {
            ...state,
            loan: {
              ...state.loan,
              financials: Remote.Success(action.payload.financials)
            }
          }
        : {
            ...state
          }
    case AT.FETCH_USER_BORROW_HISTORY_LOADING:
      return {
        ...state,
        borrowHistory: Remote.Loading
      }
    case AT.FETCH_USER_BORROW_HISTORY_FAILURE:
      return {
        ...state,
        borrowHistory: Remote.Failure(action.payload.error)
      }
    case AT.FETCH_USER_BORROW_HISTORY_SUCCESS:
      return {
        ...state,
        borrowHistory: Remote.Success(action.payload.borrowHistory)
      }
    case AT.INITIALIZE_BORROW:
    case AT.INITIALIZE_REPAY_LOAN:
    case AT.SET_COIN:
      return {
        ...state,
        coin: action.payload.coin
      }
    case AT.SET_LIMITS:
      return {
        ...state,
        limits: action.payload.limits
      }
    case AT.SET_PAYMENT_FAILURE:
      return {
        ...state,
        payment: Remote.Failure(action.payload.error)
      }
    case AT.SET_PAYMENT_LOADING:
      return {
        ...state,
        payment: Remote.Loading
      }
    case AT.SET_PAYMENT_SUCCESS:
      return {
        ...state,
        payment: Remote.Success(action.payload.payment)
      }
    case AT.SET_STEP:
      switch (action.payload.step) {
        case 'CHECKOUT': {
          return {
            ...state,
            step: action.payload.step,
            offer: action.payload.offer
          }
        }
        default: {
          return {
            ...state,
            offer: action.payload.offer,
            loan: action.payload.loan,
            step: action.payload.step
          }
        }
      }
    default:
      return state
  }
}

import Remote from 'blockchain-wallet-v4/src/remote/remote'

import * as AT from './actionTypes'
import { BorrowActionTypes, BorrowState } from './types'

const INITIAL_STATE: BorrowState = {
  borrowHistory: Remote.NotAsked,
  coin: 'BTC',
  limits: {
    maxFiat: 0,
    minFiat: 0
  },
  offer: undefined,
  loan: undefined,
  loanTransactions: Remote.NotAsked,
  offers: Remote.NotAsked,
  payment: Remote.NotAsked,
  step: 'CHECKOUT'
}

export function borrowReducer(
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
    case AT.FETCH_LOAN_TRANSACTIONS_LOADING:
      return {
        ...state,
        loanTransactions: Remote.Loading
      }
    case AT.FETCH_LOAN_TRANSACTIONS_FAILURE:
      return {
        ...state,
        loanTransactions: Remote.Failure(action.payload.error)
      }
    case AT.FETCH_LOAN_TRANSACTIONS_SUCCESS:
      return {
        ...state,
        loanTransactions: Remote.Success(action.payload.transactions)
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
        case 'CHECKOUT':
        case 'CONFIRM': {
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

import * as AT from './actionTypes'
import { BorrowActionTypes, BorrowState } from './types'
import Remote from 'blockchain-wallet-v4/src/remote/remote'

const INITIAL_STATE: BorrowState = {
  coin: 'BTC',
  offers: Remote.NotAsked,
  payment: Remote.NotAsked
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
    case AT.INITIALIZE_BORROW:
      return {
        ...state,
        coin: action.payload.coin
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
    default:
      return state
  }
}

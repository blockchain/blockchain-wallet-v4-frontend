import * as AT from './actionTypes'
import { BorrowActionTypes, BorrowState } from './types'
import Remote from 'blockchain-wallet-v4/src/remote/remote'

const INITIAL_STATE: BorrowState = {
  offers: Remote.NotAsked
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
    default:
      return state
  }
}

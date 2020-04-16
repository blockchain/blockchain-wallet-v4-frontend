import * as AT from './actionTypes'
import { InterestActionTypes, InterestState } from './types'

const INITIAL_STATE: InterestState = {
  coin: 'BTC'
}

export function interestReducer(
  state = INITIAL_STATE,
  action: InterestActionTypes
): InterestState {
  switch (action.type) {
    case AT.INITIALIZE_INTEREST: {
      return {
        ...state,
        coin: action.payload.coin
      }
    }

    default:
      return state
  }
}

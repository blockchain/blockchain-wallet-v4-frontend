import Remote from '../../../remote'
import * as AT from './actionTypes'
import { CoinsActionTypes, CoinsState } from './types'

const INITIAL_STATE: CoinsState = {
  rates: {} as CoinsState['rates'],
  transactions: [],
  transactions_at_bound: false
}

export const coinsReducer = (state = INITIAL_STATE, action: CoinsActionTypes): CoinsState => {
  switch (action.type) {
    case AT.FETCH_COINS_RATES_FAILURE:
      return {
        ...state,
        rates: {
          ...state.rates,
          [action.payload.coin]: Remote.Failure(action.payload)
        }
      }
    case AT.FETCH_COINS_RATES_LOADING:
      return {
        ...state,
        rates: {
          ...state.rates,
          [action.payload.coin]: Remote.Loading
        }
      }
    case AT.FETCH_COINS_RATES_SUCCESS:
      return {
        ...state,
        rates: {
          ...state.rates,
          [action.payload.coin]: Remote.Success(action.payload.rates)
        }
      }
    default: {
      return state
    }
  }
}

export default coinsReducer

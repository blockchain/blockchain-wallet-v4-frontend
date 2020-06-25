import * as AT from './actionTypes'

import { AlgoActionTypes, AlgoState } from './types'
import { Remote } from 'core'

const INITIAL_STATE: AlgoState = {
  rates: Remote.NotAsked,
  transactions: [],
  transactions_at_bound: false
}

export const algoReducer = (
  state = INITIAL_STATE,
  action: AlgoActionTypes
): AlgoState => {
  switch (action.type) {
    case AT.FETCH_ALGO_TRANSACTIONS_FAILURE:
      return {
        ...state,
        transactions: [Remote.Failure(action.payload)]
      }
    case AT.FETCH_ALGO_TRANSACTIONS_LOADING:
      return {
        ...state,
        transactions: [...state.transactions, Remote.Loading()]
      }
    case AT.FETCH_ALGO_TRANSACTIONS_SUCCESS:
      return {
        ...state,
        transactions: [...state.transactions, Remote.Success(action.payload)]
      }
    default: {
      return state
    }
  }
}

export default algoReducer

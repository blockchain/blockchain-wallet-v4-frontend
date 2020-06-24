import { AlgoState } from './types'
import { Remote } from 'core'

const INITIAL_STATE: AlgoState = {
  rates: Remote.NotAsked,
  transactions: [],
  transactions_at_bound: false
}

export const algoReducer = (state = INITIAL_STATE, action): AlgoState => {
  switch (action.payload) {
    default: {
      return state
    }
  }
}

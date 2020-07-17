import Remote from 'blockchain-wallet-v4/src/remote/remote'

import * as AT from './actionTypes'
import { FiatActionTypes, FiatStateType } from './types'
import { RemoteDataType, SBTransactionsType } from 'core/types'

const DEFAULT_STATE = {
  transactions: [],
  next: Remote.NotAsked,
  prev: Remote.NotAsked
}

const INITIAL_STATE: FiatStateType = {
  EUR: DEFAULT_STATE,
  GBP: DEFAULT_STATE
}

let txs: Array<RemoteDataType<string, SBTransactionsType['items']>>

export const fiatReducer = (
  state = INITIAL_STATE,
  action: FiatActionTypes
): FiatStateType => {
  switch (action.type) {
    case AT.FETCH_FIAT_TRANSACTIONS_FAILURE:
      return {
        ...state,
        [action.payload.currency]: {
          transactions: [Remote.Failure(action.payload.error)],
          next: Remote.Failure(action.payload.error),
          prev: Remote.Failure(action.payload.error)
        }
      }
    case AT.FETCH_FIAT_TRANSACTIONS_LOADING:
      txs = state[action.payload.currency]?.transactions || []
      return {
        ...state,
        [action.payload.currency]: {
          transactions: action.payload.reset
            ? [Remote.Loading]
            : txs
            ? [...txs, Remote.Loading]
            : [Remote.Loading],
          next: Remote.Loading,
          prev: Remote.Loading
        }
      }
    case AT.FETCH_FIAT_TRANSACTIONS_SUCCESS:
      txs = state[action.payload.currency]?.transactions || []
      return {
        ...state,
        [action.payload.currency]: {
          transactions: [
            Remote.Success(action.payload.response.items),
            ...txs.filter((tx, i) => i !== txs.length - 1)
          ],
          next: Remote.Success(action.payload.response.next),
          prev: Remote.Success(action.payload.response.prev)
        }
      }
    default: {
      return state
    }
  }
}

export default fiatReducer

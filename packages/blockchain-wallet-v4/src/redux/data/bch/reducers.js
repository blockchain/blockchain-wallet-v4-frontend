import { append, assoc, assocPath, compose, dropLast, lensProp, merge, over } from 'ramda'

import Remote from '../../../remote'
import * as AT from './actionTypes'

const INITIAL_STATE = {
  addresses: Remote.NotAsked,
  fee: Remote.NotAsked,
  info: Remote.NotAsked,
  latest_block: Remote.NotAsked,
  transaction_history: Remote.NotAsked,
  transactions: [],
  transactions_at_bound: false
}

const bchReducer = (state = INITIAL_STATE, action) => {
  const { payload, type } = action

  switch (type) {
    case AT.SET_BCH_LATEST_BLOCK: {
      return assocPath(['latest_block'], Remote.Success(payload), state)
    }
    case AT.FETCH_BCH_DATA_LOADING: {
      const data = {
        addresses: Remote.Loading,
        info: Remote.Loading,
        latest_block: Remote.Loading
      }
      return merge(state, data)
    }
    case AT.FETCH_BCH_DATA_SUCCESS: {
      const { addresses, info, latest_block } = payload
      const data = {
        addresses: Remote.Success(addresses),
        info: Remote.Success(info),
        latest_block: Remote.Success(latest_block)
      }
      return merge(state, data)
    }
    case AT.FETCH_BCH_DATA_FAILURE: {
      const data = {
        addresses: Remote.Failure(payload),
        info: Remote.Failure(payload),
        latest_block: Remote.Failure(payload)
      }
      return merge(state, data)
    }
    case AT.FETCH_BCH_FEE_LOADING: {
      return assoc('fee', Remote.Loading, state)
    }
    case AT.FETCH_BCH_FEE_SUCCESS: {
      return assoc('fee', Remote.Success(payload), state)
    }
    case AT.FETCH_BCH_FEE_FAILURE: {
      return assoc('fee', Remote.Failure(payload), state)
    }
    case AT.FETCH_BCH_TRANSACTIONS_LOADING: {
      const { reset } = payload
      return reset
        ? assoc('transactions', [Remote.Loading], state)
        : over(lensProp('transactions'), append(Remote.Loading), state)
    }
    case AT.FETCH_BCH_TRANSACTIONS_SUCCESS: {
      const { reset, transactions } = payload
      return reset
        ? assoc('transactions', [Remote.Success(transactions)], state)
        : over(
            lensProp('transactions'),
            compose(append(Remote.Success(transactions)), dropLast(1)),
            state
          )
    }
    case AT.FETCH_BCH_TRANSACTIONS_FAILURE: {
      return assoc('transactions', [Remote.Failure(payload)], state)
    }
    case AT.BCH_TRANSACTIONS_AT_BOUND: {
      return assoc('transactions_at_bound', payload, state)
    }
    case AT.FETCH_BCH_TRANSACTION_HISTORY_LOADING: {
      return assoc('transaction_history', Remote.Loading, state)
    }
    case AT.FETCH_BCH_TRANSACTION_HISTORY_SUCCESS: {
      return assoc('transaction_history', Remote.Success(payload), state)
    }
    case AT.FETCH_BCH_TRANSACTION_HISTORY_FAILURE: {
      return assoc('transaction_history', Remote.Failure(payload), state)
    }
    case AT.CLEAR_BCH_TRANSACTION_HISTORY: {
      return assoc('transaction_history', Remote.NotAsked, state)
    }
    default:
      return state
  }
}

export default bchReducer

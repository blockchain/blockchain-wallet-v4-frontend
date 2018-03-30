import {assoc, merge, prop} from 'ramda'
import * as AT from './actionTypes'
import Remote from '../../../remote'

const INITIAL_STATE = {
  addresses: Remote.NotAsked,
  fee: Remote.NotAsked,
  info: Remote.NotAsked,
  latest_block: Remote.NotAsked,
  rates: Remote.NotAsked,
  transactions: Remote.NotAsked
}

export default (state = INITIAL_STATE, action) => {
  const { type, payload } = action

  switch (type) {
    case AT.FETCH_ETHEREUM_DATA_LOADING: {
      const newState = {
        addresses: Remote.Loading,
        info: Remote.Loading,
        latest_block: Remote.Loading,
        transactions: Remote.Loading
      }
      return merge(state, newState)
    }
    case AT.FETCH_ETHEREUM_DATA_SUCCESS: {
      const newState = {
        addresses: Remote.Success(prop('addresses', payload)),
        info: Remote.Success(prop('info', payload)),
        latest_block: Remote.Success(prop('latest_block', payload)),
        transactions: Remote.Success(prop('transactions', payload))
      }
      return merge(state, newState)
    }
    case AT.FETCH_ETHEREUM_DATA_FAILURE: {
      const newState = {
        addresses: Remote.Failure(prop('addresses', payload)),
        info: Remote.Failure(prop('info', payload)),
        latest_block: Remote.Failure(prop('latest_block', payload)),
        transactions: Remote.Failure(prop('transactions', payload))
      }
      return merge(state, newState)
    }
    case AT.FETCH_ETHEREUM_FEE_LOADING: {
      return assoc('fee', Remote.Loading, state)
    }
    case AT.FETCH_ETHEREUM_FEE_SUCCESS: {
      return assoc('fee', Remote.Success(payload), state)
    }
    case AT.FETCH_ETHEREUM_FEE_FAILURE: {
      return assoc('fee', Remote.Failure(payload), state)
    }
    case AT.FETCH_ETHEREUM_LATEST_BLOCK_LOADING: {
      return assoc('latest_block', Remote.Loading, state)
    }
    case AT.FETCH_ETHEREUM_LATEST_BLOCK_SUCCESS: {
      return assoc('latest_Block', Remote.Success(payload), state)
    }
    case AT.FETCH_ETHEREUM_LATEST_BLOCK_FAILURE: {
      return assoc('latest_block', Remote.Failure(payload), state)
    }
    case AT.FETCH_ETHEREUM_RATES_LOADING: {
      return assoc('rates', Remote.Loading, state)
    }
    case AT.FETCH_ETHEREUM_RATES_SUCCESS: {
      return assoc('rates', Remote.Success(payload), state)
    }
    case AT.FETCH_ETHEREUM_RATES_FAILURE: {
      return assoc('rates', Remote.Failure(payload), state)
    }
    case AT.FETCH_ETHEREUM_TRANSACTIONS_LOADING: {
      return assoc('transactions', Remote.Loading, state)
    }
    case AT.FETCH_ETHEREUM_TRANSACTION_SUCCESS: {
      return assoc('transactions', Remote.Success(payload), state)
    }
    case AT.FETCH_ETHEREUM_TRANSACTION_FAILURE: {
      return assoc('transactions', Remote.Failure(payload), state)
    }
    default:
      return state
  }
}
